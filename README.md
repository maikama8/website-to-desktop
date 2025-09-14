# 🚀 WebToDesk

**Convert any website into a native desktop application for macOS, Windows, and Linux in minutes!**

WebToDesk is a powerful tool built on the Electron framework that allows you to create a desktop app from any live website or local web project. No coding knowledge is required. Just follow this guide to customize, build, and deploy your application.

---

## ✨ Features

* **Cross-Platform:** Build for macOS, Windows, and Linux with a single codebase.
* **Easy Configuration:** All settings are managed through a simple `config.js` file.
* **Customizable Menus:** Design your own main menu and right-click context menus.
* **Local Pages:** Add custom offline pages like "About Us" or "Contact."
* **Element Hiding:** Use CSS selectors to hide unwanted web elements for a cleaner, more native feel.
* **Custom Icons:** Easily set your own application icons for each operating system.

---

## 🔧 Getting Started: Configuration

All customizations are done inside the `public/config.js` file. Open it in your favorite code editor to get started.

### **1. Basic Application Settings**

First, set the core details for your application.

```javascript
// public/config.js

module.exports = {
  url: "[https://your-website-url.com](https://your-website-url.com)", // The URL of the website you want to convert
  app_name: "My Awesome App",           // Your application's name
  app_description: "A cool description of my app.", // A short description
  app_width: 1280,                      // The initial width of the app window
  app_height: 800                       // The initial height of the app window
};

2. Customizing the Application Menus
You can define the main menu (at the top of the screen) and the right-click context menu.

To add a new menu item: Add a new object to the menu array.

To link to a local HTML file: Use the format file://pages/your-file.html.
// public/config.js

module.exports = {
  // ... other settings

  menu: [
    {
      label: "File",
      submenu: [
        { label: "New Window", action: "new-window" },
        { type: "separator" },
        { label: "Close", role: "quit" }
      ]
    },
    {
      label: "About",
      submenu: [
        {
          label: "About App",
          // This links to a local file in the 'public/pages/' directory
          link: "file://pages/about.html"
        }
      ]
    }
  ]
};

3. Hiding Unwanted Web Elements
For a true native app feel, you might want to hide elements like website headers, footers, or ads. Add CSS selectors to the hide_elements array.

// public/config.js

module.exports = {
  // ... other settings

  // Use CSS selectors to hide elements.
  // Example: 'header' hides the <header> tag, '#cookie-banner' hides an element with id="cookie-banner"
  hide_elements: ["header", "footer", ".ads-container"]
};

4. Changing the Application Icon
To set a custom icon for your app, replace the default icon files located in the build/ directory.

macOS: build/icon.icns

Windows: build/icon.ico

Linux: build/icon.png


🛠️ Build and Run Your Application
You'll need Node.js and npm installed on your computer to build the app.

1. Install Dependencies
First, open your terminal, navigate to the project directory, and run this command to install all the necessary packages.
npm install

2. Run in Development Mode
To test your application locally before building, run:
npm start
This will launch the app in a development window, allowing you to see your changes live.

3. Build for Production
When you're ready to create the final, distributable application files, use the following commands:

For macOS:

Bash

npm run build-mac
For Windows:

Bash

npm run build-windows
For Linux:

Bash

npm run build-linux
After the build process is complete, you will find the application files inside the dist/ directory, ready to be shared and installed!

📂 Project File Structure
.
├── dist/                # Your final, packaged application files appear here
├── build/               # Contains app icons and build resources
├── node_modules/        # Dependencies are installed here
├── public/
│   ├── config.js        # ★ YOUR MAIN CONFIGURATION FILE ★
│   ├── electron.js      # The main Electron process file
│   └── pages/           # Put your local HTML pages here (e.g., about.html)
└── package.json         # Project metadata and scripts

❓ Support
If you have any questions or run into issues, please feel free to open an issue on this repository or contact us at zarachtech@gmail.com
