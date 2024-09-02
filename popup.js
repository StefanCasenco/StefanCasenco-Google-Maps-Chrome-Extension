document.addEventListener('DOMContentLoaded', function() {
    let scrapeCount = 0;
    let resultCount = 0;
    let filteredResultCount = 0;

    function filterByPlaceId(data) {
        const uniqueData = [];
        const ids = new Set();

        data.forEach(item => {
            if (!ids.has(item.placeId)) {
                ids.add(item.placeId);
                uniqueData.push(item);
            }
        });

        return uniqueData;
    }

    function updateScrapeResults(filtered = false) {
        document.getElementById('scrapeCount').textContent = scrapeCount;
        document.getElementById('resultCount').textContent = filtered ? filteredResultCount : resultCount;
    }

    function updateResultsHeader(filtering) {
        const resultHeader = document.getElementById('resultHeader');
        resultHeader.textContent = filtering ? 'Results *' : 'Results';
    }

    function populateResultsTable(data) {
        const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

        while (resultsTable.firstChild) {
            resultsTable.removeChild(resultsTable.firstChild);
        }

        data.forEach(function(item) {
            const row = document.createElement('tr');

            ['storeName', 'phone', 'stars', 'numberOfReviews', 'category', 'bizWebsite', 'googleUrl', 'address'].forEach(field => {
                const cell = document.createElement('td');
                cell.textContent = item[field] || '-';
                row.appendChild(cell);
            });

            resultsTable.appendChild(row);
        });
    }

    if (chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(['activeTabId', 'scrapedData'], (data) => {
            const activeTabId = data.activeTabId;
            resultCount = (data.scrapedData || []).length;

            const filterCheckbox = document.getElementById('filterCheckbox');

            let displayedData = data.scrapedData || [];

            if (filterCheckbox.checked) {
                displayedData = filterByPlaceId(displayedData);
            }

            filteredResultCount = displayedData.length;

            updateScrapeResults(filterCheckbox.checked);
            populateResultsTable(displayedData);
            updateResultsHeader(filterCheckbox.checked);

            if (activeTabId) {
                chrome.tabs.get(activeTabId, function(tab) {
                    const actionButton = document.getElementById('actionButton');
                    const downloadCsvButton = document.getElementById('downloadCsvButton');

                    actionButton.disabled = false;
                    actionButton.classList.add('enabled');

                    actionButton.addEventListener('click', function() {
                        chrome.scripting.executeScript({
                            target: {tabId: activeTabId},
                            function: scrapeData
                        }, function(results) {
                            chrome.storage.local.get('scrapedData', function(data) {
                                let existingData = data.scrapedData || [];

                                if (results && results[0] && results[0].result) {
                                    existingData = existingData.concat(results[0].result);
                                    scrapeCount++;
                                    resultCount = existingData.length;

                                    let displayData = existingData;
                                    if (filterCheckbox.checked) {
                                        displayData = filterByPlaceId(existingData);
                                    }
                                    filteredResultCount = displayData.length;

                                    chrome.storage.local.set({ scrapedData: existingData }, function() {
                                        console.log('Data saved to storage');
                                    });

                                    updateScrapeResults(filterCheckbox.checked);
                                    populateResultsTable(displayData);
                                    updateResultsHeader(filterCheckbox.checked);

                                    downloadCsvButton.disabled = false;
                                }
                            });
                        });
                    });

                    downloadCsvButton.addEventListener('click', function() {
                        chrome.storage.local.get('scrapedData', function(data) {
                            let existingData = data.scrapedData || [];
                            if (filterCheckbox.checked) {
                                existingData = filterByPlaceId(existingData);
                            }
                            var csv = jsonToCsv(existingData);
                            var filename = 'google-maps-data.csv';
                            downloadFile(csv, filename, 'text/csv');
                        });
                    });

                    filterCheckbox.addEventListener('change', function() {
                        chrome.storage.local.get('scrapedData', function(data) {
                            let existingData = data.scrapedData || [];
                            if (filterCheckbox.checked) {
                                existingData = filterByPlaceId(existingData);
                            }
                            filteredResultCount = existingData.length;

                            updateResultsHeader(filterCheckbox.checked);
                            populateResultsTable(existingData);
                            updateScrapeResults(filterCheckbox.checked);
                        });
                    });
                });
            }
        });
    } else {
        console.error('chrome.storage.local is not available');
    }
});

function scrapeData() {
    const places = Array.from(document.querySelectorAll('.Nv2PK'));
    const businesses = places.map(place => {
        const url = place.querySelector('a[href^="https://www.google.com/maps/place/"]')?.href || '';
        const website = place.querySelector('a[data-value="Website"]')?.href || '';
        const storeName = place.querySelector("div.fontHeadlineSmall")?.textContent || '';
        const ratingText = place.querySelector("span.fontBodyMedium > span")?.ariaLabel || '';

        const bodyDiv = place.querySelector("div.fontBodyMedium");
        const children = Array.from(bodyDiv.children || []);
        const lastChild = children[children.length - 1];
        const firstOfLast = lastChild?.children[0] || {};
        const lastOfLast = lastChild?.children[1] || {};

        let address;
        if (place.querySelector('.google-symbols[aria-label="Wheelchair accessible entrance"]')) {
            address = firstOfLast?.textContent?.split("·")[2]?.trim() || '';
        } else {
            address = firstOfLast?.textContent?.split("·")[1]?.trim() || '';
        }

        return {
            placeId: `ChI${url?.split("?")[0]?.split("ChI")[1]}`,
            address: address,
            category: firstOfLast?.textContent?.split("·")[0]?.trim() || '',
            phone: lastOfLast?.textContent?.split("·")[1]?.trim() || '',
            googleUrl: url,
            bizWebsite: website,
            storeName,
            ratingText,
            stars: ratingText?.split("stars")[0]?.trim()
                ? Number(ratingText.split("stars")[0].trim()).toFixed(1)
                : null,
            numberOfReviews: ratingText?.split("stars")[1]?.replace("Reviews", "").trim()
                ? Number(ratingText.split("stars")[1].replace("Reviews", "").trim())
                : null,
        };
    });

    return businesses;
}

function jsonToCsv(json) {
    const items = json;
    const replacer = (key, value) => value === null ? '' : value; 
    const header = ['storeName', 'phone', 'stars', 'numberOfReviews', 'category', 'bizWebsite', 'googleUrl', 'address'];
    const csv = [
        'Business Name,Phone Number,Rating,Reviews,Category,Website,Google Maps URL,Address',
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    return csv;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], {type: mimeType});
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}