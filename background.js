let extensionWindowId = null;

chrome.action.onClicked.addListener((tab) => {
    if (extensionWindowId !== null) {
        chrome.windows.remove(extensionWindowId, () => {
            extensionWindowId = null;
            chrome.storage.local.clear(() => {
                console.log('Storage cleared as the previous extension window was closed.');
                openExtensionWindow(tab);
            });
        });
    } else {
        openExtensionWindow(tab);
    }
});

function openExtensionWindow(tab) {
    // Fixed size for the extension window
    const width = 650;
    const height = 400;

    // Get the current window to position the new window relative to it
    chrome.windows.getCurrent({}, (currentWindow) => {
        const left = currentWindow.left + currentWindow.width - width;
        const top = currentWindow.top;

        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: width,
            height: height,
            left: left,
            top: top
        }, (newWindow) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            extensionWindowId = newWindow.id;
            chrome.storage.local.set({ activeTabId: tab.id });
        });
    });
}

chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === extensionWindowId) {
        extensionWindowId = null;
        chrome.storage.local.clear(() => {
            console.log('Storage cleared as the extension window was closed.');
        });
    }
});