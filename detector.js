// This script runs in the page context to detect technologies
(function() {
  'use strict';

  const detectedTechs = [];

  // Get the signatures from the extension
  function detectTechnologies(signatures) {
    const html = document.documentElement.outerHTML;
    const scripts = Array.from(document.scripts);
    const links = Array.from(document.querySelectorAll('link'));
    const metas = Array.from(document.querySelectorAll('meta'));

    for (const [category, categoryData] of Object.entries(signatures)) {
      for (const [techName, techData] of Object.entries(categoryData.technologies)) {
        let detected = false;
        let confidence = 0;
        let version = null;
        const matches = [];

        for (const pattern of techData.patterns) {
          try {
            if (pattern.type === 'html') {
              const regex = new RegExp(pattern.content, 'i');
              if (regex.test(html)) {
                detected = true;
                confidence += 20;
                matches.push('HTML content');
              }
            }

            else if (pattern.type === 'script') {
              const regex = new RegExp(pattern.src, 'i');
              const foundScript = scripts.some(script => {
                if (script.src && regex.test(script.src)) {
                  // Try to extract version from script src
                  const versionMatch = script.src.match(/[\d]+\.[\d]+\.[\d]+/);
                  if (versionMatch) {
                    version = versionMatch[0];
                  }
                  return true;
                }
                return false;
              });
              if (foundScript) {
                detected = true;
                confidence += 30;
                matches.push('Script tag');
              }
            }

            else if (pattern.type === 'link') {
              const regex = new RegExp(pattern.href, 'i');
              const foundLink = links.some(link =>
                link.href && regex.test(link.href)
              );
              if (foundLink) {
                detected = true;
                confidence += 25;
                matches.push('Link tag');
              }
            }

            else if (pattern.type === 'meta') {
              const regex = new RegExp(pattern.content, 'i');
              const foundMeta = metas.some(meta => {
                if (meta.name && pattern.name && meta.name.toLowerCase() === pattern.name.toLowerCase()) {
                  if (meta.content && regex.test(meta.content)) {
                    // Try to extract version
                    const versionMatch = meta.content.match(/[\d]+\.[\d]+(?:\.[\d]+)?/);
                    if (versionMatch) {
                      version = versionMatch[0];
                    }
                    return true;
                  }
                }
                return false;
              });
              if (foundMeta) {
                detected = true;
                confidence += 35;
                matches.push('Meta tag');
              }
            }

            else if (pattern.type === 'global') {
              if (typeof window[pattern.name] !== 'undefined') {
                detected = true;
                confidence += 40;
                matches.push('Global variable');

                // Try to get version from global object
                const global = window[pattern.name];
                if (global && typeof global === 'object') {
                  if (global.version) {
                    version = global.version;
                  } else if (global.VERSION) {
                    version = global.VERSION;
                  }
                }
              }
            }

            else if (pattern.type === 'cookie') {
              const regex = new RegExp(pattern.name, 'i');
              const cookies = document.cookie.split(';');
              const foundCookie = cookies.some(cookie => {
                const cookieName = cookie.trim().split('=')[0];
                return regex.test(cookieName);
              });
              if (foundCookie) {
                detected = true;
                confidence += 25;
                matches.push('Cookie');
              }
            }
          } catch (e) {
            console.error('Error detecting', techName, ':', e);
          }
        }

        if (detected) {
          // Cap confidence at 100
          confidence = Math.min(confidence, 100);
          
          detectedTechs.push({
            name: techName,
            category: category,
            confidence: confidence,
            version: version,
            matches: matches
          });
        }
      }
    }

    return detectedTechs;
  }

  // Listen for message from content script
  window.addEventListener('message', function(event) {
    if (event.data.type === 'DETECT_TECH' && event.data.signatures) {
      const results = detectTechnologies(event.data.signatures);
      window.postMessage({ 
        type: 'TECH_DETECTED', 
        technologies: results 
      }, '*');
    }
  });

  // Signal that detector is ready
  window.postMessage({ type: 'DETECTOR_READY' }, '*');
})();
