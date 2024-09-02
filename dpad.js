// Event listener for the right button
document.querySelector('.right-button').addEventListener('click', function() {
    chrome.storage.local.get('activeTabId', (data) => {
        const activeTabId = data.activeTabId;
        if (activeTabId) {
            chrome.scripting.executeScript({
                target: {tabId: activeTabId},
                function: () => {
                    const map = document.querySelector('.widget-scene-canvas');
                    if (map) {
                        // Force focus on the map element
                        map.focus();
                        
                        // Simulate pressing the right arrow key (keydown)
                        const rightArrowKeyDownEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,  // Right arrow key
                            code: 'ArrowRight'
                        });
                        map.dispatchEvent(rightArrowKeyDownEvent);

                        // Immediately simulate releasing the key (keyup)
                        const rightArrowKeyUpEvent = new KeyboardEvent('keyup', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 39,  // Right arrow key
                            code: 'ArrowRight'
                        });
                        map.dispatchEvent(rightArrowKeyUpEvent);
                    }
                }
            });
        }
    });
});

// Event listener for the up button
document.querySelector('.up-button').addEventListener('click', function() {
    chrome.storage.local.get('activeTabId', (data) => {
        const activeTabId = data.activeTabId;
        if (activeTabId) {
            chrome.scripting.executeScript({
                target: {tabId: activeTabId},
                function: () => {
                    const map = document.querySelector('.widget-scene-canvas');
                    if (map) {
                        // Force focus on the map element
                        map.focus();

                        // Simulate pressing the up arrow key (keydown)
                        const upArrowKeyDownEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 38,  // Up arrow key
                            code: 'ArrowUp'
                        });
                        map.dispatchEvent(upArrowKeyDownEvent);

                        // Immediately simulate releasing the key (keyup)
                        const upArrowKeyUpEvent = new KeyboardEvent('keyup', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 38,  // Up arrow key
                            code: 'ArrowUp'
                        });
                        map.dispatchEvent(upArrowKeyUpEvent);
                    }
                }
            });
        }
    });
});

// Event listener for the left button
document.querySelector('.left-button').addEventListener('click', function() {
    chrome.storage.local.get('activeTabId', (data) => {
        const activeTabId = data.activeTabId;
        if (activeTabId) {
            chrome.scripting.executeScript({
                target: {tabId: activeTabId},
                function: () => {
                    const map = document.querySelector('.widget-scene-canvas');
                    if (map) {
                        // Force focus on the map element
                        map.focus();

                        // Simulate pressing the left arrow key (keydown)
                        const leftArrowKeyDownEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,  // Left arrow key
                            code: 'ArrowLeft'
                        });
                        map.dispatchEvent(leftArrowKeyDownEvent);

                        // Immediately simulate releasing the key (keyup)
                        const leftArrowKeyUpEvent = new KeyboardEvent('keyup', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 37,  // Left arrow key
                            code: 'ArrowLeft'
                        });
                        map.dispatchEvent(leftArrowKeyUpEvent);
                    }
                }
            });
        }
    });
});

// Event listener for the down button
document.querySelector('.down-button').addEventListener('click', function() {
    chrome.storage.local.get('activeTabId', (data) => {
        const activeTabId = data.activeTabId;
        if (activeTabId) {
            chrome.scripting.executeScript({
                target: {tabId: activeTabId},
                function: () => {
                    const map = document.querySelector('.widget-scene-canvas');
                    if (map) {
                        // Force focus on the map element
                        map.focus();

                        // Simulate pressing the down arrow key (keydown)
                        const downArrowKeyDownEvent = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 40,  // Down arrow key
                            code: 'ArrowDown'
                        });
                        map.dispatchEvent(downArrowKeyDownEvent);

                        // Immediately simulate releasing the key (keyup)
                        const downArrowKeyUpEvent = new KeyboardEvent('keyup', {
                            bubbles: true,
                            cancelable: true,
                            keyCode: 40,  // Down arrow key
                            code: 'ArrowDown'
                        });
                        map.dispatchEvent(downArrowKeyUpEvent);
                    }
                }
            });
        }
    });
});