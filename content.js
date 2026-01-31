// Content script - runs in the context of web pages
(function () {
  'use strict';

  let detectionData = {
    technologies: [],
    headers: {},
    domain: window.location.hostname
  };

  // Inject the detector script into the page
  function injectDetector() {
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('detector.js');
    script.onload = function () {
      this.remove();
    };
    (document.head || document.documentElement).appendChild(script);
  }

  // Listen for messages from the injected script
  window.addEventListener('message', function (event) {
    if (event.source !== window) return;

    if (event.data.type === 'DETECTOR_READY') {
      // Send signatures to detector
      fetch(chrome.runtime.getURL('signatures.json'))
        .then(response => response.json())
        .then(signatures => {
          window.postMessage({
            type: 'DETECT_TECH',
            signatures: signatures
          }, '*');
        });
    }

    if (event.data.type === 'TECH_DETECTED') {
      detectionData.technologies = event.data.technologies;
      // Send to background script for storage
      chrome.runtime.sendMessage({
        type: 'TECH_RESULTS',
        data: detectionData
      });
    }
  });

  // Fetch headers via background script
  chrome.runtime.sendMessage({
    type: 'GET_HEADERS',
    url: window.location.href
  }, function (response) {
    if (response && response.headers) {
      detectionData.headers = response.headers;

      // Analyze headers for server technologies
      analyzeHeaders(response.headers);
    }
  });

  function analyzeHeaders(headers) {
    // This will be handled by the background script
    // and merged with the results
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type === 'GET_DETECTION_DATA') {
      sendResponse(detectionData);
    }
    return true;
  });

  // Start detection
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDetector);
  } else {
    injectDetector();
  }
})();
