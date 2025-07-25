# 🎨 UI Designer CLI

An interactive command-line tool that helps you generate comprehensive UI/UX design prompts and templates for your projects.

## ✨ Features

- **Interactive Interface Type Selection** - Choose from web apps, mobile apps, desktop software, CLI tools, smartwatch apps, and more
- **Comprehensive Design Prompts** - Get detailed design recommendations tailored to your project type
- **ASCII Wireframe Templates** - Visual wireframe layouts for different interface types
- **Design Style Guidance** - 8 different design styles from minimal to futuristic
- **Implementation Suggestions** - Technology stack recommendations for each platform
- **Color Palette Generation** - Style-specific color palette suggestions
- **Accessibility Guidelines** - Built-in accessibility and mobile design guidelines
- **Export Functionality** - Save your design prompts to text files

## 🚀 Installation

### Prerequisites
- Node.js 14.0.0 or higher
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run the Application
```bash
npm start
# or
node ui-designer-cli.js
```

### Make it Globally Available (Optional)
```bash
npm install -g .
ui-designer
```

## 📱 Interface Types Supported

1. **🌐 Web Application** - Responsive web apps with grid layouts
2. **📱 Mobile Application** - iOS/Android apps with touch-friendly designs
3. **🖥️ Desktop Software** - Desktop applications with familiar UI patterns
4. **⌨️ Command Line Tool** - CLI tools with clear command structures
5. **⌚ Smartwatch App** - Wearable apps with minimal interactions
6. **🔌 Other** - Custom interface types

## 🎨 Design Styles Available

- **🔵 Minimal & Clean** - Simple, uncluttered designs
- **🌈 Modern & Vibrant** - Contemporary with bold colors
- **🎪 Playful & Fun** - Engaging and entertaining interfaces
- **💼 Professional & Corporate** - Business-focused designs
- **🌙 Dark & Sleek** - Dark mode optimized interfaces
- **🌿 Nature & Organic** - Earth-toned, natural designs
- **🚀 Futuristic & Tech** - High-tech, sci-fi inspired
- **📰 Classic & Traditional** - Timeless, conventional layouts

## 🛠️ Usage Flow

1. **Welcome Screen** - ASCII art title and introduction
2. **Interface Selection** - Choose your project type
3. **Project Details** - Answer questions about:
   - Purpose of the application
   - Target users
   - Number of screens/pages
   - Key features required
   - Design style preference
   - Color preferences
   - Additional requirements

4. **Generated Output** - Receive:
   - Comprehensive design prompt
   - Platform-specific recommendations
   - Implementation suggestions
   - ASCII wireframe template

5. **Additional Options**:
   - Create another design
   - Save prompt to file
   - View color palettes
   - Check mobile guidelines
   - Review accessibility checklist

## 📋 Example Output

```
🎨 UI/UX DESIGN PROMPT
==================================================

Project Type: Mobile Application
Purpose: Social media app for photographers
Target Users: Photography enthusiasts, ages 18-35
Screen Count: 8
Key Features: Photo sharing, filters, social feed, messaging
Design Style: Modern & Vibrant
Color Preferences: Blues and oranges

🎯 DESIGN RECOMMENDATIONS:
• Follow platform-specific guidelines (Material Design/Human Interface)
• Use thumb-friendly touch targets (minimum 44px)
• Implement intuitive gesture controls
• Consider offline functionality

🛠️ IMPLEMENTATION SUGGESTIONS:
• Native: Swift (iOS), Kotlin (Android)
• Cross-platform: React Native, Flutter, or Xamarin
• Design Tools: Sketch, Figma, or Adobe XD

🎨 WIREFRAME TEMPLATE:
┌─────────────────┐
│   Status Bar    │
├─────────────────┤
│ ← Title    ≡    │
├─────────────────┤
│                 │
│   Main Content  │
│                 │
└─────────────────┘
```

## 📁 File Structure

```
ui-designer-cli/
├── ui-designer-cli.js    # Main application file
├── package.json          # Dependencies and scripts
├── README.md            # This file
└── ui-design-prompt-*.txt # Generated output files
```

## 🎯 Additional Features

### Color Palette Generator
Get style-specific color suggestions:
- Minimal & Clean: Neutral grays and whites
- Modern & Vibrant: Bold, contrasting colors
- Professional: Business-appropriate colors
- Dark & Sleek: Dark themes with accent colors
- Nature & Organic: Earth tones and greens

### Mobile Guidelines
- Touch target sizes (44px iOS / 48dp Android)
- One-handed use optimization
- Native navigation patterns
- Gesture implementation
- Battery usage considerations

### Accessibility Checklist
- Color contrast ratios (4.5:1)
- Alternative text for images
- Semantic HTML elements
- Keyboard navigation
- Screen reader compatibility
- Focus indicators
- ARIA labels

## 🔧 Development

### Run in Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

## 📦 Dependencies

- **chalk** (^4.1.2) - Terminal colors and styling
- **figlet** (^1.6.0) - ASCII art text generation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🙋 Support

If you encounter any issues or have suggestions:
- Open an issue on GitHub
- Check existing documentation
- Review the troubleshooting section

## 🚀 Future Enhancements

- [ ] Export to popular design formats (Figma, Sketch)
- [ ] More wireframe templates
- [ ] Component library suggestions
- [ ] Design system recommendations
- [ ] Integration with design tools APIs
- [ ] Project collaboration features
- [ ] Advanced customization options

---

Made with ❤️ for designers and developers who want to streamline their UI/UX design process.
