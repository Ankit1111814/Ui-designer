#!/usr/bin/env node

const inquirer = require('inquirer');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class FrontendUIBuilder {
    constructor() {
        this.answers = {};
        this.projectPath = '';
    }

    async run() {
        console.clear();
        console.log(chalk.cyanBright("🎨 Welcome to Frontend UI Builder CLI"));
        console.log(chalk.gray("Answer a few questions and get your complete frontend UI ready!\n"));

        try {
            await this.collectUserPreferences();
            await this.generateProject();
            this.showSuccessMessage();
        } catch (error) {
            console.error(chalk.red('❌ Error:', error.message));
            process.exit(1);
        }
    }

    async collectUserPreferences() {
        this.answers = await inquirer.prompt([
            {
                type: "list",
                name: "uiType",
                message: "1️⃣ What type of UI do you want to build?",
                choices: [
                    { name: "🏠 Landing Page", value: "landing" },
                    { name: "📊 Dashboard", value: "dashboard" },
                    { name: "👤 Portfolio Website", value: "portfolio" },
                    { name: "🛒 E-commerce App", value: "ecommerce" },
                    { name: "📝 Blog Interface", value: "blog" },
                    { name: "⚙️  Custom Application", value: "custom" }
                ]
            },
            {
                type: "list",
                name: "colorTheme",
                message: "2️⃣ Choose a color theme for your UI:",
                choices: [
                    { name: "☀️  Light Theme", value: "light" },
                    { name: "🌙 Dark Theme", value: "dark" },
                    { name: "🎨 Pastel Colors", value: "pastel" },
                    { name: "⚡ Neon/Vibrant", value: "neon" },
                    { name: "🎯 Custom Colors", value: "custom" }
                ]
            },
            {
                type: "list",
                name: "designStyle",
                message: "3️⃣ What design style would you prefer?",
                choices: [
                    { name: "🔹 Minimalistic", value: "minimal" },
                    { name: "✨ Modern", value: "modern" },
                    { name: "📐 Material Design", value: "material" },
                    { name: "💎 Glassmorphism", value: "glass" },
                    { name: "🔲 Brutalist", value: "brutalist" }
                ]
            },
            {
                type: "list",
                name: "frontendFramework",
                message: "4️⃣ Select a frontend framework to use:",
                choices: [
                    { name: "⚛️  React.js", value: "react" },
                    { name: "💚 Vue.js", value: "vue" },
                    { name: "🔥 Svelte", value: "svelte" },
                    { name: "📄 Plain HTML/CSS/JS", value: "vanilla" }
                ]
            },
            {
                type: "list",
                name: "cssFramework",
                message: "5️⃣ Choose a CSS framework or utility library:",
                choices: [
                    { name: "🎨 Tailwind CSS", value: "tailwind" },
                    { name: "🅱️  Bootstrap", value: "bootstrap" },
                    { name: "📐 Material UI", value: "mui" },
                    { name: "🎯 Chakra UI", value: "chakra" },
                    { name: "✏️  Plain CSS", value: "plain" }
                ]
            },
            {
                type: "input",
                name: "projectName",
                message: "6️⃣ What should be the name of your project folder?",
                default: "my-ui-project",
                validate: (input) => {
                    if (!input.trim()) return 'Project name cannot be empty';
                    if (!/^[a-zA-Z0-9-_]+$/.test(input)) return 'Project name can only contain letters, numbers, hyphens, and underscores';
                    return true;
                }
            },
            {
                type: "confirm",
                name: "includeRouter",
                message: "7️⃣ Include routing setup?",
                default: true,
                when: (answers) => answers.frontendFramework !== 'vanilla'
            },
            {
                type: "confirm",
                name: "includeStateManagement",
                message: "8️⃣ Include state management?",
                default: false,
                when: (answers) => ['react', 'vue'].includes(answers.frontendFramework)
            },
            {
                type: "list",
                name: "stateManager",
                message: "   Which state management library?",
                choices: [
                    { name: "Redux Toolkit", value: "redux" },
                    { name: "Zustand", value: "zustand" },
                    { name: "Recoil", value: "recoil" },
                    { name: "Vuex/Pinia", value: "vuex" }
                ],
                when: (answers) => answers.includeStateManagement
            }
        ]);

        console.log(chalk.greenBright("\n✅ Summary of Your Choices:"));
        console.log(chalk.cyan("UI Type:"), chalk.white(this.getUITypeLabel(this.answers.uiType)));
        console.log(chalk.cyan("Color Theme:"), chalk.white(this.getColorThemeLabel(this.answers.colorTheme)));
        console.log(chalk.cyan("Design Style:"), chalk.white(this.getDesignStyleLabel(this.answers.designStyle)));
        console.log(chalk.cyan("Framework:"), chalk.white(this.getFrameworkLabel(this.answers.frontendFramework)));
        console.log(chalk.cyan("CSS Framework:"), chalk.white(this.getCSSFrameworkLabel(this.answers.cssFramework)));
        console.log(chalk.cyan("Project Name:"), chalk.white(this.answers.projectName));
        
        const confirm = await inquirer.prompt([
            {
                type: "confirm",
                name: "proceed",
                message: "🚀 Proceed with project generation?",
                default: true
            }
        ]);

        if (!confirm.proceed) {
            console.log(chalk.yellow("👋 Project generation cancelled."));
            process.exit(0);
        }
    }

    async generateProject() {
        console.log(chalk.blue("\n🔨 Generating your project..."));
        
        this.projectPath = path.join(process.cwd(), this.answers.projectName);
        
        // Check if directory already exists
        if (fs.existsSync(this.projectPath)) {
            const overwrite = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "overwrite",
                    message: `Directory "${this.answers.projectName}" already exists. Overwrite?`,
                    default: false
                }
            ]);
            
            if (!overwrite.overwrite) {
                console.log(chalk.yellow("👋 Project generation cancelled."));
                process.exit(0);
            }
            
            // Remove existing directory
            fs.rmSync(this.projectPath, { recursive: true, force: true });
        }

        // Create project directory
        fs.mkdirSync(this.projectPath, { recursive: true });

        // Generate based on framework choice
        switch (this.answers.frontendFramework) {
            case 'react':
                await this.generateReactProject();
                break;
            case 'vue':
                await this.generateVueProject();
                break;
            case 'svelte':
                await this.generateSvelteProject();
                break;
            case 'vanilla':
                await this.generateVanillaProject();
                break;
        }

        // Generate additional files
        this.generateReadme();
        this.generateGitignore();
    }

    async generateReactProject() {
        console.log(chalk.blue("⚛️  Setting up React project..."));
        
        // Create React app structure
        const packageJson = this.getReactPackageJson();
        fs.writeFileSync(path.join(this.projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

        // Create directory structure
        const dirs = ['src', 'src/components', 'src/pages', 'src/styles', 'src/assets', 'public'];
        dirs.forEach(dir => fs.mkdirSync(path.join(this.projectPath, dir), { recursive: true }));

        // Generate main files
        this.generateReactFiles();
        
        // Install dependencies
        console.log(chalk.blue("📦 Installing dependencies..."));
        try {
            execSync('npm install', { cwd: this.projectPath, stdio: 'inherit' });
        } catch (error) {
            console.log(chalk.yellow("⚠️  Failed to install dependencies automatically. Please run 'npm install' manually."));
        }
    }

    async generateVueProject() {
        console.log(chalk.green("💚 Setting up Vue project..."));
        
        const packageJson = this.getVuePackageJson();
        fs.writeFileSync(path.join(this.projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

        const dirs = ['src', 'src/components', 'src/views', 'src/assets', 'src/styles', 'public'];
        dirs.forEach(dir => fs.mkdirSync(path.join(this.projectPath, dir), { recursive: true }));

        this.generateVueFiles();
        
        console.log(chalk.blue("📦 Installing dependencies..."));
        try {
            execSync('npm install', { cwd: this.projectPath, stdio: 'inherit' });
        } catch (error) {
            console.log(chalk.yellow("⚠️  Failed to install dependencies automatically. Please run 'npm install' manually."));
        }
    }

    async generateSvelteProject() {
        console.log(chalk.red("🔥 Setting up Svelte project..."));
        
        const packageJson = this.getSveltePackageJson();
        fs.writeFileSync(path.join(this.projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

        const dirs = ['src', 'src/components', 'src/routes', 'src/lib', 'static'];
        dirs.forEach(dir => fs.mkdirSync(path.join(this.projectPath, dir), { recursive: true }));

        this.generateSvelteFiles();
        
        console.log(chalk.blue("📦 Installing dependencies..."));
        try {
            execSync('npm install', { cwd: this.projectPath, stdio: 'inherit' });
        } catch (error) {
            console.log(chalk.yellow("⚠️  Failed to install dependencies automatically. Please run 'npm install' manually."));
        }
    }

    async generateVanillaProject() {
        console.log(chalk.yellow("📄 Setting up Vanilla HTML/CSS/JS project..."));
        
        const dirs = ['css', 'js', 'images', 'assets'];
        dirs.forEach(dir => fs.mkdirSync(path.join(this.projectPath, dir), { recursive: true }));

        this.generateVanillaFiles();
    }

    generateReactFiles() {
        // Main App.js
        const appJs = this.getReactAppComponent();
        fs.writeFileSync(path.join(this.projectPath, 'src/App.js'), appJs);

        // Index.js
        const indexJs = this.getReactIndexFile();
        fs.writeFileSync(path.join(this.projectPath, 'src/index.js'), indexJs);

        // Generate components based on UI type
        this.generateReactComponents();

        // Generate styles
        this.generateReactStyles();

        // Index.html
        const indexHtml = this.getReactIndexHtml();
        fs.writeFileSync(path.join(this.projectPath, 'public/index.html'), indexHtml);
    }

    generateVueFiles() {
        // Main App.vue
        const appVue = this.getVueAppComponent();
        fs.writeFileSync(path.join(this.projectPath, 'src/App.vue'), appVue);

        // Main.js
        const mainJs = this.getVueMainFile();
        fs.writeFileSync(path.join(this.projectPath, 'src/main.js'), mainJs);

        // Generate components
        this.generateVueComponents();

        // Generate styles
        this.generateVueStyles();

        // Index.html
        const indexHtml = this.getVueIndexHtml();
        fs.writeFileSync(path.join(this.projectPath, 'public/index.html'), indexHtml);

        // Vite config
        const viteConfig = this.getViteConfig();
        fs.writeFileSync(path.join(this.projectPath, 'vite.config.js'), viteConfig);
    }

    generateSvelteFiles() {
        // Main App.svelte
        const appSvelte = this.getSvelteAppComponent();
        fs.writeFileSync(path.join(this.projectPath, 'src/App.svelte'), appSvelte);

        // Main.js
        const mainJs = this.getSvelteMainFile();
        fs.writeFileSync(path.join(this.projectPath, 'src/main.js'), mainJs);

        // Generate components
        this.generateSvelteComponents();

        // Generate styles
        this.generateSvelteStyles();

        // Index.html
        const indexHtml = this.getSvelteIndexHtml();
        fs.writeFileSync(path.join(this.projectPath, 'src/app.html'), indexHtml);

        // Vite config
        const viteConfig = this.getSvelteViteConfig();
        fs.writeFileSync(path.join(this.projectPath, 'vite.config.js'), viteConfig);
    }

    generateVanillaFiles() {
        // Main HTML
        const indexHtml = this.getVanillaIndexHtml();
        fs.writeFileSync(path.join(this.projectPath, 'index.html'), indexHtml);

        // Main CSS
        const mainCss = this.getVanillaMainCss();
        fs.writeFileSync(path.join(this.projectPath, 'css/main.css'), mainCss);

        // Main JS
        const mainJs = this.getVanillaMainJs();
        fs.writeFileSync(path.join(this.projectPath, 'js/main.js'), mainJs);

        // Generate additional HTML pages based on UI type
        this.generateVanillaPages();
    }

    // Package.json generators
    getReactPackageJson() {
        const base = {
            name: this.answers.projectName,
            version: "0.1.0",
            private: true,
            scripts: {
                start: "react-scripts start",
                build: "react-scripts build",
                test: "react-scripts test",
                eject: "react-scripts eject"
            },
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                "react-scripts": "5.0.1"
            }
        };

        // Add CSS framework dependencies
        if (this.answers.cssFramework === 'tailwind') {
            base.dependencies.tailwindcss = "^3.3.0";
            base.devDependencies = {
                autoprefixer: "^10.4.14",
                postcss: "^8.4.24"
            };
        } else if (this.answers.cssFramework === 'bootstrap') {
            base.dependencies.bootstrap = "^5.3.0";
        } else if (this.answers.cssFramework === 'mui') {
            base.dependencies["@mui/material"] = "^5.13.0";
            base.dependencies["@emotion/react"] = "^11.11.0";
            base.dependencies["@emotion/styled"] = "^11.11.0";
        } else if (this.answers.cssFramework === 'chakra') {
            base.dependencies["@chakra-ui/react"] = "^2.7.0";
            base.dependencies["@emotion/react"] = "^11.11.0";
            base.dependencies["@emotion/styled"] = "^11.11.0";
            base.dependencies["framer-motion"] = "^10.12.0";
        }

        // Add routing
        if (this.answers.includeRouter) {
            base.dependencies["react-router-dom"] = "^6.11.0";
        }

        // Add state management
        if (this.answers.includeStateManagement) {
            if (this.answers.stateManager === 'redux') {
                base.dependencies["@reduxjs/toolkit"] = "^1.9.0";
                base.dependencies["react-redux"] = "^8.1.0";
            } else if (this.answers.stateManager === 'zustand') {
                base.dependencies.zustand = "^4.3.0";
            } else if (this.answers.stateManager === 'recoil') {
                base.dependencies.recoil = "^0.7.0";
            }
        }

        return base;
    }

    getVuePackageJson() {
        const base = {
            name: this.answers.projectName,
            version: "0.0.0",
            private: true,
            scripts: {
                dev: "vite",
                build: "vite build",
                preview: "vite preview"
            },
            dependencies: {
                vue: "^3.3.0"
            },
            devDependencies: {
                "@vitejs/plugin-vue": "^4.2.0",
                vite: "^4.3.0"
            }
        };

        // Add CSS framework dependencies
        if (this.answers.cssFramework === 'tailwind') {
            base.devDependencies.tailwindcss = "^3.3.0";
            base.devDependencies.autoprefixer = "^10.4.14";
            base.devDependencies.postcss = "^8.4.24";
        } else if (this.answers.cssFramework === 'bootstrap') {
            base.dependencies.bootstrap = "^5.3.0";
        }

        // Add routing
        if (this.answers.includeRouter) {
            base.dependencies["vue-router"] = "^4.2.0";
        }

        // Add state management
        if (this.answers.includeStateManagement) {
            base.dependencies.pinia = "^2.1.0";
        }

        return base;
    }

    getSveltePackageJson() {
        return {
            name: this.answers.projectName,
            version: "0.0.1",
            private: true,
            scripts: {
                build: "vite build",
                dev: "vite dev",
                preview: "vite preview"
            },
            devDependencies: {
                "@sveltejs/adapter-auto": "^2.0.0",
                "@sveltejs/kit": "^1.20.4",
                svelte: "^4.0.5",
                vite: "^4.4.2"
            },
            dependencies: this.answers.cssFramework === 'tailwind' ? {
                tailwindcss: "^3.3.0",
                autoprefixer: "^10.4.14",
                postcss: "^8.4.24"
            } : {}
        };
    }

    // Component generators
    getReactAppComponent() {
        const imports = this.getReactImports();
        const content = this.getUIContent('react');
        
        return `${imports}

function App() {
  return (
    <div className="App">
      ${content}
    </div>
  );
}

export default App;`;
    }

    getReactImports() {
        let imports = `import React from 'react';\nimport './App.css';`;
        
        if (this.answers.includeRouter) {
            imports += `\nimport { BrowserRouter as Router, Routes, Route } from 'react-router-dom';`;
        }
        
        if (this.answers.cssFramework === 'mui') {
            imports += `\nimport { ThemeProvider, createTheme, CssBaseline } from '@mui/material';`;
        } else if (this.answers.cssFramework === 'chakra') {
            imports += `\nimport { ChakraProvider } from '@chakra-ui/react';`;
        }

        return imports;
    }

    getVueAppComponent() {
        const content = this.getUIContent('vue');
        
        return `<template>
  <div id="app">
    ${content}
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
${this.getMainStyles()}
</style>`;
    }

    getSvelteAppComponent() {
        const content = this.getUIContent('svelte');
        
        return `<script>
  // Component logic here
</script>

<main>
  ${content}
</main>

<style>
  ${this.getMainStyles()}
</style>`;
    }

    // Content generators based on UI type
    getUIContent(framework) {
        const templates = {
            landing: this.getLandingPageContent(framework),
            dashboard: this.getDashboardContent(framework),
            portfolio: this.getPortfolioContent(framework),
            ecommerce: this.getEcommerceContent(framework),
            blog: this.getBlogContent(framework),
            custom: this.getCustomContent(framework)
        };

        return templates[this.answers.uiType] || templates.custom;
    }

    getLandingPageContent(framework) {
        if (framework === 'react') {
            return `
      <header className="hero">
        <nav className="navbar">
          <div className="nav-brand">Your Brand</div>
          <ul className="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Your Landing Page</h1>
          <p className="hero-subtitle">Build something amazing with our tools</p>
          <button className="cta-button">Get Started</button>
        </div>
      </header>
      
      <section className="features">
        <div className="container">
          <h2>Our Features</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Feature 1</h3>
              <p>Description of your first feature</p>
            </div>
            <div className="feature-card">
              <h3>Feature 2</h3>
              <p>Description of your second feature</p>
            </div>
            <div className="feature-card">
              <h3>Feature 3</h3>
              <p>Description of your third feature</p>
            </div>
          </div>
        </div>
      </section>`;
        }
        
        return `
    <header class="hero">
      <nav class="navbar">
        <div class="nav-brand">Your Brand</div>
        <ul class="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
      <div class="hero-content">
        <h1 class="hero-title">Welcome to Your Landing Page</h1>
        <p class="hero-subtitle">Build something amazing with our tools</p>
        <button class="cta-button">Get Started</button>
      </div>
    </header>`;
    }

    getDashboardContent(framework) {
        if (framework === 'react') {
            return `
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-brand">Dashboard</div>
          <nav className="sidebar-nav">
            <ul>
              <li><a href="#overview">Overview</a></li>
              <li><a href="#analytics">Analytics</a></li>
              <li><a href="#users">Users</a></li>
              <li><a href="#settings">Settings</a></li>
            </ul>
          </nav>
        </aside>
        
        <main className="main-content">
          <header className="dashboard-header">
            <h1>Dashboard Overview</h1>
            <div className="user-menu">
              <span>Welcome, User!</span>
            </div>
          </header>
          
          <div className="dashboard-grid">
            <div className="metric-card">
              <h3>Total Users</h3>
              <div className="metric-value">1,234</div>
            </div>
            <div className="metric-card">
              <h3>Revenue</h3>
              <div className="metric-value">$12,345</div>
            </div>
            <div className="metric-card">
              <h3>Orders</h3>
              <div className="metric-value">567</div>
            </div>
            <div className="metric-card">
              <h3>Growth</h3>
              <div className="metric-value">+12%</div>
            </div>
          </div>
        </main>
      </div>`;
        }
        
        return `
    <div class="dashboard">
      <aside class="sidebar">
        <div class="sidebar-brand">Dashboard</div>
        <nav class="sidebar-nav">
          <ul>
            <li><a href="#overview">Overview</a></li>
            <li><a href="#analytics">Analytics</a></li>
            <li><a href="#users">Users</a></li>
            <li><a href="#settings">Settings</a></li>
          </ul>
        </nav>
      </aside>
      
      <main class="main-content">
        <header class="dashboard-header">
          <h1>Dashboard Overview</h1>
        </header>
        
        <div class="dashboard-grid">
          <div class="metric-card">
            <h3>Total Users</h3>
            <div class="metric-value">1,234</div>
          </div>
          <div class="metric-card">
            <h3>Revenue</h3>
            <div class="metric-value">$12,345</div>
          </div>
        </div>
      </main>
    </div>`;
    }

    getPortfolioContent(framework) {
        if (framework === 'react') {
            return `
      <div className="portfolio">
        <header className="portfolio-header">
          <div className="profile">
            <div className="profile-image"></div>
            <h1>Your Name</h1>
            <p>Web Developer & Designer</p>
          </div>
        </header>
        
        <section className="portfolio-projects">
          <h2>My Projects</h2>
          <div className="project-grid">
            <div className="project-card">
              <div className="project-image"></div>
              <h3>Project 1</h3>
              <p>Description of your project</p>
            </div>
            <div className="project-card">
              <div className="project-image"></div>
              <h3>Project 2</h3>
              <p>Description of your project</p>
            </div>
          </div>
        </section>
      </div>`;
        }
        
        return `
    <div class="portfolio">
      <header class="portfolio-header">
        <div class="profile">
          <div class="profile-image"></div>
          <h1>Your Name</h1>
          <p>Web Developer & Designer</p>
        </div>
      </header>
      
      <section class="portfolio-projects">
        <h2>My Projects</h2>
        <div class="project-grid">
          <div class="project-card">
            <div class="project-image"></div>
            <h3>Project 1</h3>
          </div>
        </div>
      </section>
    </div>`;
    }

    getEcommerceContent(framework) {
        return `<div class="ecommerce-layout">E-commerce interface coming soon...</div>`;
    }

    getBlogContent(framework) {
        return `<div class="blog-layout">Blog interface coming soon...</div>`;
    }

    getCustomContent(framework) {
        return `<div class="custom-layout">Your custom application structure</div>`;
    }

    // Style generators
    getMainStyles() {
        const colorVars = this.getColorVariables();
        const baseStyles = this.getBaseStyles();
        const componentStyles = this.getComponentStyles();
        
        return `${colorVars}\n\n${baseStyles}\n\n${componentStyles}`;
    }

    getColorVariables() {
        const themes = {
            light: `
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;`,
            dark: `
  --primary-color: #60a5fa;
  --secondary-color: #94a3b8;
  --background-color: #111827;
  --text-color: #f9fafb;
  --border-color: #374151;`,
            pastel: `
  --primary-color: #fbbf24;
  --secondary-color: #f472b6;
  --background-color: #fef3c7;
  --text-color: #374151;
  --border-color: #fde68a;`,
            neon: `
  --primary-color: #10b981;
  --secondary-color: #8b5cf6;
  --background-color: #000000;
  --text-color: #00ff88;
  --border-color: #00ff88;`,
            custom: `
  --primary-color: #4f46e5;
  --secondary-color: #7c3aed;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #d1d5db;`
        };

        return `:root {${themes[this.answers.colorTheme]}\n}`;
    }

    getBaseStyles() {
        return `
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  line-height: 1.6;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`;
    }

    getComponentStyles() {
        return `
/* Navigation */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.nav-brand {
  font-weight: bold;
  font-size: 1.5rem;
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* Buttons */
.cta-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.3s;
}

.cta-button:hover {
  opacity: 0.9;
}

/* Cards */
.card {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}`;
    }

    // File generators for specific frameworks
    getReactIndexFile() {
        return `import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;
    }

    getVueMainFile() {
        return `import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

createApp(App).mount('#app')`;
    }

    getSvelteMainFile() {
        return `import App from './App.svelte'

const app = new App({
  target: document.getElementById('app'),
})

export default app`;
    }

    generateReactComponents() {
        // Generate specific components based on UI type
        const componentDir = path.join(this.projectPath, 'src/components');
        
        // Header component
        const headerComponent = `import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <h1>Your App Header</h1>
    </header>
  );
};

export default Header;`;
        
        fs.writeFileSync(path.join(componentDir, 'Header.js'), headerComponent);
    }

    generateVueComponents() {
        const componentDir = path.join(this.projectPath, 'src/components');
        
        const headerComponent = `<template>
  <header class="header">
    <h1>Your App Header</h1>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
.header {
  padding: 1rem;
  background: var(--primary-color);
  color: white;
}
</style>`;
        
        fs.writeFileSync(path.join(componentDir, 'Header.vue'), headerComponent);
    }

    generateSvelteComponents() {
        const componentDir = path.join(this.projectPath, 'src/components');
        
        const headerComponent = `<script>
  // Component logic
</script>

<header class="header">
  <h1>Your App Header</h1>
</header>

<style>
  .header {
    padding: 1rem;
    background: var(--primary-color);
    color: white;
  }
</style>`;
        
        fs.writeFileSync(path.join(componentDir, 'Header.svelte'), headerComponent);
    }

    generateReactStyles() {
        const appCss = this.getMainStyles();
        fs.writeFileSync(path.join(this.projectPath, 'src/App.css'), appCss);
        
        const indexCss = `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}`;
        fs.writeFileSync(path.join(this.projectPath, 'src/index.css'), indexCss);
    }

    generateVueStyles() {
        const styleCss = this.getMainStyles();
        fs.writeFileSync(path.join(this.projectPath, 'src/style.css'), styleCss);
    }

    generateSvelteStyles() {
        const appCss = this.getMainStyles();
        fs.writeFileSync(path.join(this.projectPath, 'src/app.css'), appCss);
    }

    // HTML generators
    getReactIndexHtml() {
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Web site created using Frontend UI Builder CLI" />
    <title>${this.answers.projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;
    }

    getVueIndexHtml() {
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.answers.projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`;
    }

    getSvelteIndexHtml() {
        return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width" />
    <title>${this.answers.projectName}</title>
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`;
    }

    getVanillaIndexHtml() {
        const content = this.getUIContent('vanilla');
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.answers.projectName}</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    ${content}
    <script src="js/main.js"></script>
</body>
</html>`;
    }

    getVanillaMainCss() {
        return this.getMainStyles();
    }

    getVanillaMainJs() {
        return `// Main JavaScript for ${this.answers.projectName}
console.log('${this.answers.projectName} loaded successfully!');

// Add your JavaScript functionality here
document.addEventListener('DOMContentLoaded', function() {
    // Initialize your app
    console.log('DOM fully loaded');
});`;
    }

    generateVanillaPages() {
        // Generate additional pages based on UI type
        if (this.answers.uiType === 'landing') {
            const aboutHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About - ${this.answers.projectName}</title>
    <link rel="stylesheet" href="css/main.css">
</head>
<body>
    <h1>About Page</h1>
    <p>This is the about page for your landing page.</p>
    <a href="index.html">Back to Home</a>
</body>
</html>`;
            fs.writeFileSync(path.join(this.projectPath, 'about.html'), aboutHtml);
        }
    }

    // Config file generators
    getViteConfig() {
        return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()]
})`;
    }

    getSvelteViteConfig() {
        return `import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()]
});`;
    }

    generateReadme() {
        const readme = `# ${this.answers.projectName}

A ${this.getUITypeLabel(this.answers.uiType)} built with ${this.getFrameworkLabel(this.answers.frontendFramework)} and ${this.getCSSFrameworkLabel(this.answers.cssFramework)}.

## Features

- 🎨 ${this.getColorThemeLabel(this.answers.colorTheme)} theme
- 💫 ${this.getDesignStyleLabel(this.answers.designStyle)} design style
- 📱 Responsive design
- ⚡ Fast and modern

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   \`\`\`bash
   cd ${this.answers.projectName}
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   ${this.getStartCommand()}
   \`\`\`

4. Open your browser and visit \`http://localhost:${this.getDevPort()}\`

## Project Structure

\`\`\`
${this.getProjectStructure()}
\`\`\`

## Built With

- **Framework:** ${this.getFrameworkLabel(this.answers.frontendFramework)}
- **Styling:** ${this.getCSSFrameworkLabel(this.answers.cssFramework)}
- **Theme:** ${this.getColorThemeLabel(this.answers.colorTheme)}
- **Design Style:** ${this.getDesignStyleLabel(this.answers.designStyle)}

## Customization

You can customize the colors by modifying the CSS variables in the main stylesheet:

\`\`\`css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
  --background-color: #your-color;
  --text-color: #your-color;
}
\`\`\`

## Contributing

1. Fork the project
2. Create your feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your changes (\`git commit -m 'Add some AmazingFeature'\`)
4. Push to the branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

---

*Generated with ❤️ by Frontend UI Builder CLI*
`;

        fs.writeFileSync(path.join(this.projectPath, 'README.md'), readme);
    }

    generateGitignore() {
        const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/build
/dist
/.output

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Cache
.cache/
.parcel-cache/

# Temporary folders
tmp/
temp/
`;

        fs.writeFileSync(path.join(this.projectPath, '.gitignore'), gitignore);
    }

    // Helper methods
    getUITypeLabel(type) {
        const labels = {
            landing: 'Landing Page',
            dashboard: 'Dashboard',
            portfolio: 'Portfolio Website',
            ecommerce: 'E-commerce App',
            blog: 'Blog Interface',
            custom: 'Custom Application'
        };
        return labels[type] || 'Application';
    }

    getColorThemeLabel(theme) {
        const labels = {
            light: 'Light Theme',
            dark: 'Dark Theme',
            pastel: 'Pastel Colors',
            neon: 'Neon/Vibrant',
            custom: 'Custom Colors'
        };
        return labels[theme] || 'Default';
    }

    getDesignStyleLabel(style) {
        const labels = {
            minimal: 'Minimalistic',
            modern: 'Modern',
            material: 'Material Design',
            glass: 'Glassmorphism',
            brutalist: 'Brutalist'
        };
        return labels[style] || 'Default';
    }

    getFrameworkLabel(framework) {
        const labels = {
            react: 'React.js',
            vue: 'Vue.js',
            svelte: 'Svelte',
            vanilla: 'Plain HTML/CSS/JS'
        };
        return labels[framework] || 'Unknown';
    }

    getCSSFrameworkLabel(framework) {
        const labels = {
            tailwind: 'Tailwind CSS',
            bootstrap: 'Bootstrap',
            mui: 'Material UI',
            chakra: 'Chakra UI',
            plain: 'Plain CSS'
        };
        return labels[framework] || 'Custom';
    }

    getStartCommand() {
        const commands = {
            react: 'npm start',
            vue: 'npm run dev',
            svelte: 'npm run dev',
            vanilla: 'Open index.html in your browser'
        };
        return commands[this.answers.frontendFramework] || 'npm start';
    }

    getDevPort() {
        const ports = {
            react: '3000',
            vue: '5173',
            svelte: '5173',
            vanilla: 'N/A'
        };
        return ports[this.answers.frontendFramework] || '3000';
    }

    getProjectStructure() {
        const structures = {
            react: `${this.answers.projectName}/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   ├── pages/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── README.md`,
            vue: `${this.answers.projectName}/
├── public/
├── src/
│   ├── components/
│   ├── views/
│   ├── assets/
│   ├── App.vue
│   └── main.js
├── package.json
└── README.md`,
            svelte: `${this.answers.projectName}/
├── src/
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── App.svelte
├── static/
├── package.json
└── README.md`,
            vanilla: `${this.answers.projectName}/
├── css/
├── js/
├── images/
├── index.html
└── README.md`
        };
        return structures[this.answers.frontendFramework] || '';
    }

    showSuccessMessage() {
        console.log(chalk.green('\n🎉 Project generated successfully!'));
        console.log(chalk.cyan('\n📁 Project location:'), chalk.white(this.projectPath));
        console.log(chalk.cyan('🚀 Next steps:'));
        console.log(chalk.white(`   1. cd ${this.answers.projectName}`));
        
        if (this.answers.frontendFramework !== 'vanilla') {
            console.log(chalk.white('   2. npm install (if not already done)'));
            console.log(chalk.white(`   3. ${this.getStartCommand()}`));
        } else {
            console.log(chalk.white('   2. Open index.html in your browser'));
        }
        
        console.log(chalk.yellow('\n💡 Tips:'));
        console.log(chalk.gray('   • Check the README.md for detailed instructions'));
        console.log(chalk.gray('   • Customize colors in the CSS variables'));
        console.log(chalk.gray('   • Add your content and functionality'));
        
        console.log(chalk.magenta('\n✨ Happy coding!'));
    }
}

// Run the CLI
if (require.main === module) {
    const builder = new FrontendUIBuilder();
    builder.run().catch(console.error);
}

module.exports = FrontendUIBuilder;
