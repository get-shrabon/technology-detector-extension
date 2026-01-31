// Technology detection patterns
const TECH_SIGNATURES = {
  // CMS
  cms: {
    icon: '📝',
    technologies: {
      'WordPress': {
        patterns: [
          { type: 'meta', name: 'generator', content: /WordPress/i },
          { type: 'script', src: /wp-(?:content|includes)/i },
          { type: 'link', href: /wp-(?:content|includes)/i },
          { type: 'html', content: /<link[^>]+wp-(?:content|includes)/i }
        ]
      },
      'Shopify': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Shopify/i },
          { type: 'script', src: /cdn\.shopify\.com/i },
          { type: 'html', content: /Shopify\.shop/i }
        ]
      },
      'Drupal': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Drupal/i },
          { type: 'html', content: /drupal/i },
          { type: 'script', src: /\/sites\/(?:default|all)\/(?:modules|themes)/i }
        ]
      },
      'Joomla': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Joomla/i },
          { type: 'script', src: /\/media\/jui\//i }
        ]
      },
      'Wix': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Wix/i },
          { type: 'script', src: /static\.wixstatic\.com/i }
        ]
      },
      'Squarespace': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Squarespace/i },
          { type: 'script', src: /static1\.squarespace\.com/i }
        ]
      },
      'Webflow': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Webflow/i },
          { type: 'html', content: /webflow/i }
        ]
      }
    }
  },

  // JavaScript Frameworks
  frameworks: {
    icon: '⚛️',
    technologies: {
      'React': {
        patterns: [
          { type: 'global', name: 'React' },
          { type: 'global', name: '__REACT_DEVTOOLS_GLOBAL_HOOK__' },
          { type: 'script', src: /react(?:\.production)?\.min\.js/i },
          { type: 'html', content: /data-reactroot/i }
        ]
      },
      'Vue.js': {
        patterns: [
          { type: 'global', name: 'Vue' },
          { type: 'script', src: /vue(?:\.runtime)?(?:\.global)?(?:\.prod)?\.js/i },
          { type: 'html', content: /data-v-[a-f0-9]{8}/i }
        ]
      },
      'Angular': {
        patterns: [
          { type: 'global', name: 'ng' },
          { type: 'global', name: 'angular' },
          { type: 'html', content: /ng-version/i },
          { type: 'script', src: /angular(?:\.min)?\.js/i }
        ]
      },
      'Next.js': {
        patterns: [
          { type: 'global', name: '__NEXT_DATA__' },
          { type: 'script', src: /_next\//i },
          { type: 'html', content: /__NEXT_DATA__/i }
        ]
      },
      'Nuxt.js': {
        patterns: [
          { type: 'global', name: '__NUXT__' },
          { type: 'script', src: /_nuxt\//i }
        ]
      },
      'Svelte': {
        patterns: [
          { type: 'html', content: /svelte-[a-z0-9]+/i }
        ]
      },
      'jQuery': {
        patterns: [
          { type: 'global', name: 'jQuery' },
          { type: 'global', name: '$' },
          { type: 'script', src: /jquery(?:-\d+\.\d+\.\d+)?(?:\.min)?\.js/i }
        ]
      },
      'Ember.js': {
        patterns: [
          { type: 'global', name: 'Ember' },
          { type: 'script', src: /ember(?:\.min)?\.js/i }
        ]
      }
    }
  },

  // Analytics
  analytics: {
    icon: '📊',
    technologies: {
      'Google Analytics': {
        patterns: [
          { type: 'script', src: /google-analytics\.com\/(?:ga|analytics)\.js/i },
          { type: 'script', src: /googletagmanager\.com\/gtag\/js/i },
          { type: 'global', name: 'ga' },
          { type: 'global', name: 'gtag' }
        ]
      },
      'Google Tag Manager': {
        patterns: [
          { type: 'script', src: /googletagmanager\.com\/gtm\.js/i },
          { type: 'global', name: 'google_tag_manager' }
        ]
      },
      'Facebook Pixel': {
        patterns: [
          { type: 'script', src: /connect\.facebook\.net.*\/fbevents\.js/i },
          { type: 'global', name: 'fbq' }
        ]
      },
      'Hotjar': {
        patterns: [
          { type: 'script', src: /static\.hotjar\.com/i },
          { type: 'global', name: 'hj' }
        ]
      },
      'Mixpanel': {
        patterns: [
          { type: 'script', src: /cdn\.mxpnl\.com/i },
          { type: 'global', name: 'mixpanel' }
        ]
      },
      'Segment': {
        patterns: [
          { type: 'script', src: /cdn\.segment\.com/i },
          { type: 'global', name: 'analytics' }
        ]
      }
    }
  },

  // Web Servers (detected via headers)
  servers: {
    icon: '🖥️',
    technologies: {
      'Nginx': {
        patterns: [
          { type: 'header', name: 'server', value: /nginx/i }
        ]
      },
      'Apache': {
        patterns: [
          { type: 'header', name: 'server', value: /apache/i }
        ]
      },
      'Microsoft IIS': {
        patterns: [
          { type: 'header', name: 'server', value: /microsoft-iis/i }
        ]
      },
      'LiteSpeed': {
        patterns: [
          { type: 'header', name: 'server', value: /litespeed/i }
        ]
      }
    }
  },

  // Programming Languages
  languages: {
    icon: '💻',
    technologies: {
      'PHP': {
        patterns: [
          { type: 'header', name: 'x-powered-by', value: /php/i },
          { type: 'cookie', name: /phpsessid/i }
        ]
      },
      'Python': {
        patterns: [
          { type: 'header', name: 'server', value: /python/i },
          { type: 'header', name: 'x-powered-by', value: /python/i }
        ]
      },
      'Ruby': {
        patterns: [
          { type: 'header', name: 'server', value: /ruby/i },
          { type: 'header', name: 'x-powered-by', value: /ruby/i }
        ]
      },
      'Node.js': {
        patterns: [
          { type: 'header', name: 'x-powered-by', value: /express/i },
          { type: 'header', name: 'server', value: /node/i }
        ]
      },
      'ASP.NET': {
        patterns: [
          { type: 'header', name: 'x-aspnet-version', value: /.+/i },
          { type: 'header', name: 'x-powered-by', value: /asp\.net/i }
        ]
      }
    }
  },

  // E-commerce
  ecommerce: {
    icon: '🛒',
    technologies: {
      'Shopify': {
        patterns: [
          { type: 'meta', name: 'generator', content: /Shopify/i },
          { type: 'script', src: /cdn\.shopify\.com/i }
        ]
      },
      'WooCommerce': {
        patterns: [
          { type: 'meta', name: 'generator', content: /WooCommerce/i },
          { type: 'script', src: /woocommerce/i },
          { type: 'html', content: /woocommerce/i }
        ]
      },
      'Magento': {
        patterns: [
          { type: 'script', src: /\/static\/version\d+\//i },
          { type: 'html', content: /Magento/i },
          { type: 'cookie', name: /mage-/i }
        ]
      },
      'BigCommerce': {
        patterns: [
          { type: 'script', src: /cdn\d+\.bigcommerce\.com/i }
        ]
      },
      'PrestaShop': {
        patterns: [
          { type: 'meta', name: 'generator', content: /PrestaShop/i }
        ]
      }
    }
  },

  // CDNs
  cdn: {
    icon: '🌐',
    technologies: {
      'Cloudflare': {
        patterns: [
          { type: 'header', name: 'server', value: /cloudflare/i },
          { type: 'header', name: 'cf-ray', value: /.+/i }
        ]
      },
      'Amazon CloudFront': {
        patterns: [
          { type: 'header', name: 'x-amz-cf-id', value: /.+/i },
          { type: 'header', name: 'via', value: /cloudfront/i }
        ]
      },
      'Fastly': {
        patterns: [
          { type: 'header', name: 'x-fastly-request-id', value: /.+/i }
        ]
      },
      'Akamai': {
        patterns: [
          { type: 'header', name: 'x-akamai-transformed', value: /.+/i }
        ]
      }
    }
  },

  // Payment Processors
  payment: {
    icon: '💳',
    technologies: {
      'Stripe': {
        patterns: [
          { type: 'script', src: /js\.stripe\.com/i },
          { type: 'global', name: 'Stripe' }
        ]
      },
      'PayPal': {
        patterns: [
          { type: 'script', src: /paypal\.com.*\/sdk\/js/i },
          { type: 'global', name: 'paypal' }
        ]
      },
      'Square': {
        patterns: [
          { type: 'script', src: /js\.squareup\.com/i }
        ]
      }
    }
  },

  // Marketing Tools
  marketing: {
    icon: '📢',
    technologies: {
      'Mailchimp': {
        patterns: [
          { type: 'script', src: /list-manage\.com/i }
        ]
      },
      'HubSpot': {
        patterns: [
          { type: 'script', src: /js\.hs-scripts\.com/i },
          { type: 'global', name: '_hsq' }
        ]
      },
      'Intercom': {
        patterns: [
          { type: 'script', src: /widget\.intercom\.io/i },
          { type: 'global', name: 'Intercom' }
        ]
      },
      'Drift': {
        patterns: [
          { type: 'script', src: /js\.driftt\.com/i },
          { type: 'global', name: 'drift' }
        ]
      }
    }
  },

  // CSS Frameworks
  css: {
    icon: '🎨',
    technologies: {
      'Bootstrap': {
        patterns: [
          { type: 'html', content: /bootstrap(?:\.min)?\.css/i },
          { type: 'link', href: /bootstrap(?:\.min)?\.css/i }
        ]
      },
      'Tailwind CSS': {
        patterns: [
          { type: 'html', content: /tailwindcss/i },
          { type: 'link', href: /tailwind/i }
        ]
      },
      'Material-UI': {
        patterns: [
          { type: 'global', name: 'MaterialUI' },
          { type: 'html', content: /MuiBox-root/i }
        ]
      }
    }
  },

  // Hosting
  hosting: {
    icon: '☁️',
    technologies: {
      'Vercel': {
        patterns: [
          { type: 'header', name: 'x-vercel-id', value: /.+/i }
        ]
      },
      'Netlify': {
        patterns: [
          { type: 'header', name: 'x-nf-request-id', value: /.+/i }
        ]
      },
      'GitHub Pages': {
        patterns: [
          { type: 'header', name: 'server', value: /GitHub\.com/i }
        ]
      }
    }
  }
};
