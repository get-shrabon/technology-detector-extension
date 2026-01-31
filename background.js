// Background service worker
let currentTabData = {};

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'TECH_RESULTS') {
    const tabId = sender.tab?.id;
    if (tabId) {
      currentTabData[tabId] = request.data;

      // Update badge with count
      const count = request.data.technologies.length;
      chrome.action.setBadgeText({
        text: count > 0 ? count.toString() : '',
        tabId: tabId
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#667eea',
        tabId: tabId
      });
    }
    sendResponse({ success: true });
    return true;
  }

  if (request.type === 'GET_TAB_DATA') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const tabId = tabs[0]?.id;
      if (tabId && currentTabData[tabId]) {
        sendResponse(currentTabData[tabId]);
      } else {
        sendResponse(null);
      }
    });
    return true;
  }
});

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete currentTabData[tabId];
});

// Clean up when tab is updated (navigated to new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    delete currentTabData[tabId];
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});
