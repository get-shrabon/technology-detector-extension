// Popup script
document.addEventListener('DOMContentLoaded', function() {
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error');
  const resultsEl = document.getElementById('results');
  const domainEl = document.getElementById('domain');
  const techGridEl = document.getElementById('tech-grid');
  const exportBtn = document.getElementById('export-btn');
  const totalCountEl = document.getElementById('total-count');
  const categoryCountEl = document.getElementById('category-count');

  let allTechnologies = [];
  let currentDomain = '';

  // Category icons mapping
  const categoryIcons = {
    cms: '📝',
    'page-builder': '🏗️',
    'wordpress-plugins': '🔌',
    seo: '🎯',
    'javascript-libraries': '📚',
    frameworks: '⚛️',
    'static-site-generators': '🚀',
    'ui-frameworks': '🎭',
    analytics: '📊',
    'web-servers': '🖥️',
    'programming-languages': '💻',
    ecommerce: '🛒',
    cdn: '🌐',
    css: '🎨',
    fonts: '🔤',
    'tag-managers': '🏷️',
    databases: '🗄️',
    blogs: '✍️',
    miscellaneous: '🔧',
    rum: '⚡',
    payment: '💳',
    marketing: '📢',
    security: '🔒'
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

  function renderTechnologies(technologies) {
    techGridEl.innerHTML = '';

    if (technologies.length === 0) {
      techGridEl.innerHTML = `
        <div class="no-results">
          <p>No technologies found</p>
        </div>
      `;
      return;
    }

    // Group by category
    const grouped = technologies.reduce((acc, tech) => {
      if (!acc[tech.category]) {
        acc[tech.category] = [];
      }
      acc[tech.category].push(tech);
      return acc;
    }, {});

    // Render each category
    for (const [category, techs] of Object.entries(grouped)) {
      const categorySection = document.createElement('div');
      categorySection.className = 'category-section';

      // Format category name (handle hyphenated names)
      const categoryName = category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // Sort by confidence
      techs.sort((a, b) => b.confidence - a.confidence);

      // Create category header
      const header = document.createElement('div');
      header.className = 'category-header';
      header.innerHTML = `
        <span class="category-name">${categoryName}</span>
        <span class="category-badge">${techs.length}</span>
      `;
      categorySection.appendChild(header);

      // Create tech items container
      const techItems = document.createElement('div');
      techItems.className = 'tech-items';

      // Add technologies
      techs.forEach(tech => {
        const techEl = document.createElement('div');
        techEl.className = 'tech-item';

        const confidenceClass =
          tech.confidence >= 70 ? 'high' :
          tech.confidence >= 40 ? 'medium' : 'low';

        const confidenceText =
          tech.confidence >= 70 ? 'High' :
          tech.confidence >= 40 ? 'Medium' : 'Low';

        const versionText = tech.version ? `Version ${tech.version}` : 'Version unknown';

        techEl.innerHTML = `
          <div class="tech-icon">${getTechIcon(tech.name)}</div>
          <div class="tech-info">
            <span class="tech-name">${tech.name}</span>
            <div class="tech-version">${versionText}</div>
          </div>
          <div class="tech-confidence ${confidenceClass}">${confidenceText}</div>
        `;

        techItems.appendChild(techEl);
      });

      categorySection.appendChild(techItems);
      techGridEl.appendChild(categorySection);
    }
  }

  function getTechIcon(name) {
    const icons = {
      // CMS
      'WordPress': '📰',
      'Shopify': '🛍️',
      'Drupal': '💧',
      'Joomla': '🌐',
      'Wix': '✨',
      'Squarespace': '⬛',
      'Webflow': '🌊',
      'Ghost': '👻',

      // Page Builders
      'Elementor': '🏗️',
      'WPBakery Page Builder': '🏗️',
      'Beaver Builder': '🦫',
      'Divi Builder': '🎨',
      'Oxygen Builder': '⚙️',
      'Gutenberg': '📝',

      // WordPress Plugins
      'Yoast SEO': '🎯',
      'All in One SEO Pack': '🎯',
      'Rank Math': '📊',
      'Contact Form 7': '📧',
      'WPForms': '📝',
      'Gravity Forms': '📋',
      'Redux Framework': '🔧',
      'Advanced Custom Fields': '🔧',
      'WP Rocket': '🚀',
      'W3 Total Cache': '⚡',
      'Slider Revolution': '🎠',
      'MonsterInsights': '📊',
      'Really Simple SSL': '🔒',
      'Wordfence': '🛡️',

      // SEO
      'SEOPress': '🎯',

      // JavaScript Libraries
      'jQuery': '🔷',
      'jQuery Migrate': '🔷',
      'jQuery UI': '🎨',
      'Swiper': '🎠',
      'Slick': '🎠',
      'Select2': '📋',
      'Packery': '🧱',
      'OWL Carousel': '🦉',
      'Modernizr': '🔍',
      'Underscore.js': '_',
      'GSAP': '⚡',
      'Hammer.js': '🔨',
      'Anime.js': '✨',
      'Isotope': '🧱',
      'Masonry': '🧱',
      'Lightbox': '💡',
      'Fancybox': '📦',
      'Magnific Popup': '🔍',
      'AOS': '✨',
      'WOW.js': '🎆',
      'Parallax.js': '🌊',

      // Frameworks
      'React': '⚛️',
      'Vue.js': '💚',
      'Angular': '🅰️',
      'Svelte': '🔥',
      'Ember.js': '🐹',
      'Backbone.js': '🦴',
      'Alpine.js': '🏔️',
      'Preact': '💜',

      // Static Site Generators
      'Next.js': '▲',
      'Nuxt.js': '💚',
      'Gatsby': '🟣',
      'Hugo': '⚡',
      'Jekyll': '🧪',
      'Eleventy': '🎈',
      'Astro': '🚀',

      // UI Frameworks
      'Material-UI': '🎨',
      'Ant Design': '🐜',
      'Chakra UI': '⚡',
      'Radix UI': '🎯',
      'shadcn/ui': '🎭',
      'Semantic UI': '📱',

      // Analytics
      'Google Analytics': '📈',
      'Google Tag Manager': '🏷️',
      'Facebook Pixel': '👁️',
      'Cloudflare Browser Insights': '☁️',
      'Hotjar': '🔥',
      'Mixpanel': '📊',
      'Plausible': '📈',
      'Matomo': '📊',

      // Web Servers
      'Nginx': '🟢',
      'Apache': '🪶',
      'LiteSpeed': '⚡',
      'Microsoft IIS': '🔷',

      // Programming Languages
      'PHP': '🐘',
      'Node.js': '🟩',
      'Python': '🐍',
      'Ruby': '💎',
      'ASP.NET': '🔷',
      'Java': '☕',

      // E-commerce
      'WooCommerce': '🛒',
      'Magento': '🛍️',
      'PrestaShop': '🛒',
      'BigCommerce': '🏪',

      // CDN
      'Cloudflare': '☁️',
      'Amazon CloudFront': '📦',
      'jsDelivr': '📦',
      'unpkg': '📦',
      'cdnjs': '📦',

      // CSS
      'Bootstrap': '🅱️',
      'Tailwind CSS': '🎨',
      'Bulma': '🎯',
      'Foundation': '🏗️',

      // Fonts
      'Google Fonts': '🔤',
      'Font Awesome': '⭐',
      'Adobe Fonts': '🎨',

      // Tag Managers
      'Tealium': '🏷️',
      'Adobe Tag Manager': '🏷️',

      // Databases
      'MySQL': '🗄️',
      'PostgreSQL': '🐘',
      'MongoDB': '🍃',
      'Redis': '📦',

      // Blogs
      'Medium': '📖',
      'Blogger': '📝',

      // Miscellaneous
      'HTTP/3': '⚡',
      'webpack': '📦',
      'Vite': '⚡',
      'Parcel': '📦',

      // RUM
      'New Relic': '📊',
      'Sentry': '🐛',

      // Payment
      'Stripe': '💳',
      'PayPal': '💰',
      'Square': '⬛',

      // Marketing
      'Mailchimp': '📧',
      'HubSpot': '🔶',
      'Intercom': '💬',

      // Security
      'reCAPTCHA': '🔒',
      'hCaptcha': '🔒'
    };
    return icons[name] || '🔧';
  }

  function showError(message) {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'flex';
    document.getElementById('error-message').textContent = message;
  }

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
