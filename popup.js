// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const resultsEl = document.getElementById('results');
  const domainEl = document.getElementById('domain');
  const techListEl = document.getElementById('tech-list');
  const searchInput = document.getElementById('search');
  const exportBtn = document.getElementById('export-btn');
  const totalCountEl = document.getElementById('total-count');
  const categoryCountEl = document.getElementById('category-count');

  let allTechnologies = [];
  let currentDomain = '';

  // Category icons mapping
  const categoryIcons = {
    cms: '📝',
    frameworks: '⚛️',
    analytics: '📊',
    servers: '🖥️',
    languages: '💻',
    ecommerce: '🛒',
    cdn: '🌐',
    payment: '💳',
    marketing: '📢',
    css: '🎨',
    hosting: '☁️'
  };

  // Get current tab and request data
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const tab = tabs[0];
    
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('edge://')) {
      showError('Cannot analyze this page');
      return;
    }

    const url = new URL(tab.url);
    currentDomain = url.hostname;
    domainEl.textContent = currentDomain;

    // Request detection data from content script
    chrome.tabs.sendMessage(tab.id, { type: 'GET_DETECTION_DATA' }, function(response) {
      if (chrome.runtime.lastError) {
        // Content script might not be ready, try background
        chrome.runtime.sendMessage({ type: 'GET_TAB_DATA' }, function(bgResponse) {
          if (bgResponse && bgResponse.technologies) {
            displayResults(bgResponse.technologies);
          } else {
            // Wait a bit and try again
            setTimeout(() => {
              chrome.tabs.sendMessage(tab.id, { type: 'GET_DETECTION_DATA' }, function(retryResponse) {
                if (retryResponse && retryResponse.technologies) {
                  displayResults(retryResponse.technologies);
                } else {
                  showError('Please refresh the page and try again');
                }
              });
            }, 1000);
          }
        });
      } else if (response && response.technologies) {
        displayResults(response.technologies);
      } else {
        showError('No data available. Please refresh the page.');
      }
    });
  });

  function displayResults(technologies) {
    allTechnologies = technologies;
    
    if (technologies.length === 0) {
      showError('No technologies detected on this page');
      return;
    }

    loadingEl.style.display = 'none';
    resultsEl.style.display = 'flex';

    // Update stats
    totalCountEl.textContent = technologies.length;
    const uniqueCategories = new Set(technologies.map(t => t.category));
    categoryCountEl.textContent = uniqueCategories.size;

    // Render technology list
    renderTechnologies(technologies);
  }

  function renderTechnologies(technologies, searchTerm = '') {
    techListEl.innerHTML = '';

    // Filter technologies
    let filtered = technologies;
    if (searchTerm) {
      filtered = technologies.filter(tech => 
        tech.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filtered.length === 0) {
      techListEl.innerHTML = `
        <div class="no-results">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>No technologies found</p>
        </div>
      `;
      return;
    }

    // Group by category
    const grouped = filtered.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {});

    // Render each category
    for (const [category, techs] of Object.entries(grouped)) {
      const categoryEl = document.createElement('div');
      categoryEl.className = 'category';

      const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
      const categoryIcon = categoryIcons[category] || '🔧';

      categoryEl.innerHTML = `
        <div class="category-header">
          <span class="category-icon">${categoryIcon}</span>
          <span class="category-title">${categoryName}</span>
          <span class="category-badge">${techs.length}</span>
        </div>
      `;

      // Sort by confidence
      techs.sort((a, b) => b.confidence - a.confidence);

      // Add technologies
      techs.forEach(tech => {
        const techEl = document.createElement('div');
        techEl.className = 'tech-item';

        const confidenceClass = 
          tech.confidence >= 70 ? 'confidence-high' :
          tech.confidence >= 40 ? 'confidence-medium' : 'confidence-low';

        const confidenceText = 
          tech.confidence >= 70 ? 'High' :
          tech.confidence >= 40 ? 'Medium' : 'Low';

        const versionText = tech.version ? `v${tech.version}` : 'Version unknown';

        techEl.innerHTML = `
          <div class="tech-icon">${getTechIcon(tech.name)}</div>
          <div class="tech-info">
            <div class="tech-name">${tech.name}</div>
            <div class="tech-version">${versionText}</div>
          </div>
          <div class="tech-confidence ${confidenceClass}">${confidenceText}</div>
        `;

        categoryEl.appendChild(techEl);
      });

      techListEl.appendChild(categoryEl);
    }
  }

  function getTechIcon(name) {
    const icons = {
      'WordPress': '📰',
      'Shopify': '🛍️',
      'React': '⚛️',
      'Vue.js': '💚',
      'Angular': '🅰️',
      'jQuery': '🔷',
      'Google Analytics': '📈',
      'Facebook Pixel': '👁️',
      'Nginx': '🟢',
      'Apache': '🪶',
      'PHP': '🐘',
      'Python': '🐍',
      'Node.js': '🟩',
      'WooCommerce': '🛒',
      'Stripe': '💳',
      'PayPal': '💰',
      'Cloudflare': '☁️',
      'Bootstrap': '🅱️',
      'Tailwind CSS': '🎨'
    };
    return icons[name] || '🔧';
  }

  function showError(message) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
    document.getElementById('error-message').textContent = message;
  }

  // Search functionality
  searchInput.addEventListener('input', function(e) {
    renderTechnologies(allTechnologies, e.target.value);
  });

  // Export functionality
  exportBtn.addEventListener('click', function() {
    const exportData = {
      domain: currentDomain,
      scannedAt: new Date().toISOString(),
      totalTechnologies: allTechnologies.length,
      technologies: allTechnologies.map(tech => ({
        name: tech.name,
        category: tech.category,
        confidence: tech.confidence,
        version: tech.version,
        detectedBy: tech.matches
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `techstack-${currentDomain}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Visual feedback
    const originalText = exportBtn.innerHTML;
    exportBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Exported!
    `;
    setTimeout(() => {
      exportBtn.innerHTML = originalText;
    }, 2000);
  });
});
