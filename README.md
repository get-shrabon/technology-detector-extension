# TechStack Detector - Modern Browser Extension

A professional, modern browser extension that detects and analyzes technologies used on any website. Built with a sleek UI and comprehensive detection capabilities.

![TechStack Detector](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Features

### Comprehensive Technology Detection

- **Content Management Systems**: WordPress, Shopify, Drupal, Joomla, Wix, Squarespace, Webflow
- **JavaScript Frameworks**: React, Vue.js, Angular, Next.js, Nuxt.js, Svelte, jQuery, Ember.js
- **Analytics Tools**: Google Analytics, Google Tag Manager, Facebook Pixel, Hotjar, Mixpanel, Segment
- **Web Servers**: Nginx, Apache, Microsoft IIS, LiteSpeed
- **Programming Languages**: PHP, Python, Ruby, Node.js, ASP.NET
- **E-commerce Platforms**: Shopify, WooCommerce, Magento, BigCommerce, PrestaShop
- **CDNs**: Cloudflare, Amazon CloudFront, Fastly, Akamai
- **Payment Processors**: Stripe, PayPal, Square
- **Marketing Tools**: Mailchimp, HubSpot, Intercom, Drift
- **CSS Frameworks**: Bootstrap, Tailwind CSS, Material-UI
- **Hosting Platforms**: Vercel, Netlify, GitHub Pages

### Modern Features

✨ **Professional UI**: Clean, gradient-based design with smooth animations  
🔍 **Smart Search**: Instantly filter technologies by name  
📊 **Confidence Scoring**: Each detection is rated by confidence level  
🏷️ **Version Detection**: Automatically extracts version information when available  
📤 **JSON Export**: Export full technology stack data  
⚡ **Real-time Analysis**: Instant detection when you visit any website  
🎨 **Category Grouping**: Technologies organized by type  
📈 **Statistics**: Quick overview of total technologies and categories detected

## 📦 Installation

### For Chrome/Edge/Brave

1. **Download the extension**
   - Clone this repository or download as ZIP
   ```bash
   git clone https://github.com/get-shrabon/techstack-detector.git
   ```

2. **Open Extension Management**
   - Chrome: Navigate to `chrome://extensions/`
   - Edge: Navigate to `edge://extensions/`
   - Brave: Navigate to `brave://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top right

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `techstack-detector` folder
   - The extension icon should appear in your toolbar

### For Firefox

1. **Download the extension** (same as above)

2. **Open Add-ons**
   - Navigate to `about:debugging#/runtime/this-firefox`

3. **Load Temporary Add-on**
   - Click "Load Temporary Add-on"
   - Select the `manifest.json` file from the extension folder

## 🚀 Usage

1. **Visit any website** you want to analyze

2. **Click the extension icon** in your browser toolbar

3. **View detected technologies**
   - Technologies are grouped by category
   - Each technology shows:
     - Name and icon
     - Version (if detected)
     - Confidence level (High/Medium/Low)

4. **Search technologies**
   - Use the search box to filter by name

5. **Export data**
   - Click "Export as JSON" to download the full report

## 🎨 UI Features

### Color-Coded Confidence Levels

- 🟢 **High** (70-100%): Green - Technology definitely detected
- 🟡 **Medium** (40-69%): Yellow - Technology likely present
- 🔴 **Low** (0-39%): Red - Technology possibly present

### Categories with Icons

- 📝 CMS
- ⚛️ Frameworks
- 📊 Analytics
- 🖥️ Servers
- 💻 Languages
- 🛒 E-commerce
- 🌐 CDN
- 💳 Payment
- 📢 Marketing
- 🎨 CSS
- ☁️ Hosting

## 🔧 Technical Details

### How It Works

1. **Content Script**: Injects into web pages to access the DOM
2. **Detector Script**: Runs in page context to analyze:
   - HTML structure
   - Script tags and sources
   - Meta tags
   - Global JavaScript objects
   - Cookies
   - Link tags
3. **Background Script**: Captures HTTP headers via webRequest API
4. **Signature Matching**: Compares findings against comprehensive pattern database
5. **Confidence Scoring**: Calculates detection certainty based on multiple signals

### Detection Methods

- **HTML Analysis**: Searches for technology-specific patterns in page source
- **Script Detection**: Identifies libraries from script URLs and attributes
- **Global Variables**: Checks for framework-specific JavaScript objects
- **HTTP Headers**: Analyzes server and technology headers
- **Meta Tags**: Examines generator and other meta information
- **Cookies**: Identifies technology-specific cookie patterns

## 📁 Project Structure

```
techstack-detector/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup interface
├── popup.css              # Modern styling
├── popup.js               # UI logic and rendering
├── content.js             # Content script (bridge)
├── detector.js            # Detection engine (page context)
├── background.js          # Service worker (header analysis)
├── signatures.js          # Technology patterns database
├── icons/
│   ├── icon16.png        # Small icon
│   ├── icon48.png        # Medium icon
│   └── icon128.png       # Large icon
└── README.md             # This file
```

## 🔒 Permissions

The extension requires the following permissions:

- **activeTab**: Access current tab information
- **scripting**: Inject detection scripts
- **storage**: Cache detection results
- **webRequest**: Capture HTTP headers for server detection
- **host_permissions**: Analyze any website

## 🤝 Contributing

Contributions are welcome! To add new technology signatures:

1. Open `signatures.js`
2. Find the appropriate category or create a new one
3. Add your technology with detection patterns
4. Test thoroughly on multiple websites

### Adding a New Technology

```javascript
'Your Technology': {
  patterns: [
    { type: 'script', src: /your-tech\.js/i },
    { type: 'global', name: 'YourTech' },
    { type: 'meta', name: 'generator', content: /YourTech/i }
  ]
}
```

## 📝 License

MIT License - feel free to use this extension for personal or commercial projects.

## 🐛 Known Issues

- Some single-page applications may require a page refresh for initial detection
- HTTP header detection requires the webRequest permission
- Some heavily obfuscated sites may have limited detection

## 🚀 Future Enhancements

- [ ] Historical tracking of technology changes
- [ ] Comparison between multiple websites
- [ ] Technology trend analysis
- [ ] Browser fingerprinting protection detection
- [ ] Performance metrics integration
- [ ] API endpoint for bulk analysis

## 💡 Tips

- For best results, wait for the page to fully load before opening the extension
- Refresh the page if no technologies are detected on the first try
- Use the search feature to quickly find specific frameworks or tools
- Export data for documentation or comparison purposes

## 📧 Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contribute improvements via pull requests

## 🙏 Acknowledgments

Inspired by Wappalyzer with a modern, professional redesign focused on:
- Better user experience
- Cleaner interface
- More comprehensive detection
- Zero dependencies on external APIs

---

**Built with ❤️ for web developers, security researchers, and the curious**
