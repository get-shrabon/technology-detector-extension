// Background service worker
let currentTabData = {};
let headerCache = {};

// Listen for web requests to capture headers
chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.type === 'main_frame') {
      const headers = {};

      // Store response headers
      if (details.responseHeaders) {
        details.responseHeaders.forEach(header => {
          headers[header.name.toLowerCase()] = header.value;
        });
      }

      headerCache[details.tabId] = headers;
    }
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
// chrome.webRequest.onCompleted is not supported in manifest v3 service workers.
// If you need to analyze headers, consider using chrome.declarativeNetRequest or move logic to content scripts.

// Message handler
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_HEADERS') {
    const tabId = sender.tab?.id;
    if (tabId && headerCache[tabId]) {
      sendResponse({ headers: headerCache[tabId] });
    } else {
      sendResponse({ headers: {} });
    }
    return true;
  }

  if (request.type === 'TECH_RESULTS') {
    const tabId = sender.tab?.id;
    if (tabId) {
      currentTabData[tabId] = request.data;

      // Analyze headers and add server-side technologies
      if (request.data.headers) {
        analyzeHeadersForTech(request.data, tabId);
      }

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

function analyzeHeadersForTech(data, tabId) {
  const headers = data.headers;
  const technologies = data.technologies;

  // Load signatures
  fetch(chrome.runtime.getURL('signatures.json'))
    .then(response => response.json())
    .then(signatures => {
      // Check server technologies
      for (const [category, categoryData] of Object.entries(signatures)) {
        for (const [techName, techData] of Object.entries(categoryData.technologies)) {
          for (const pattern of techData.patterns) {
            if (pattern.type === 'header') {
              const headerValue = headers[pattern.name.toLowerCase()];
              if (headerValue && pattern.value && new RegExp(pattern.value, 'i').test(headerValue)) {
                // Check if not already detected
                const exists = technologies.some(t => t.name === techName);
                if (!exists) {
                  technologies.push({
                    name: techName,
                    category: category,
                    confidence: 80,
                    version: null,
                    matches: ['HTTP Header: ' + pattern.name]
                  });
                }
              }
            }
          }
        }
      }

      // Update stored data
      currentTabData[tabId] = data;

      // Update badge
      const count = technologies.length;
      chrome.action.setBadgeText({
        text: count > 0 ? count.toString() : '',
        tabId: tabId
      });
    })
    .catch(err => console.error('Error analyzing headers:', err));
}

// Clean up when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete currentTabData[tabId];
  delete headerCache[tabId];
});

// Clean up when tab is updated (navigated to new URL)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading') {
    delete currentTabData[tabId];
    chrome.action.setBadgeText({ text: '', tabId: tabId });
  }
});
