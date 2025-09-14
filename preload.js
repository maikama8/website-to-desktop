const { ipcRenderer } = require('electron');

// This function will run as soon as the page's DOM is available.
document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Create the Loader ---
    const style = document.createElement('style');
    style.innerHTML = `
        .app-loader {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(255, 255, 255, 0.9); display: flex;
            justify-content: center; align-items: center; z-index: 9999;
            transition: opacity 0.3s; pointer-events: none; opacity: 0;
        }
        .app-loader.is-visible { opacity: 1; pointer-events: auto; }
        .lds-dual-ring { display: inline-block; width: 80px; height: 80px; }
        .lds-dual-ring:after {
            content: " "; display: block; width: 64px; height: 64px; margin: 8px;
            border-radius: 50%; border: 6px solid #333;
            border-color: #333 transparent #333 transparent;
            animation: lds-dual-ring 1.2s linear infinite;
        }
        @keyframes lds-dual-ring {
            0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    const loaderDiv = document.createElement('div');
    loaderDiv.className = 'app-loader';
    loaderDiv.id = 'app-loader';
    loaderDiv.innerHTML = '<div class="lds-dual-ring"></div>';
    document.body.appendChild(loaderDiv);

    // --- 2. Handle the reload button on your offline.html page ---
    const tryAgainBtn = document.getElementById("tryagain");
    if (tryAgainBtn) {
        tryAgainBtn.onclick = () => {
            ipcRenderer.send('online-status-changed', true);
        };
    }
});

// --- 3. Listen for messages from main.js ---

// Listen for messages to show/hide the loader
ipcRenderer.on('show-loader', () => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.add('is-visible');
});

ipcRenderer.on('hide-loader', () => {
    const loader = document.getElementById('app-loader');
    if (loader) loader.classList.remove('is-visible');
});

// Listen for config data from main.js to apply custom changes
ipcRenderer.on('apply-dom-changes', (event, config) => {
    // Set Application Title from Config
    document.title = config.appName;

    // Hide Webpage Elements Using Config
    function hideElements(selectorType, elementsList) {
        elementsList.forEach(selector => {
            let elements = selectorType === "id" ? 
                           document.getElementById(selector) : 
                           document.getElementsByClassName(selector);
            if (elements) {
                if (selectorType === "id") {
                    elements.style.display = "none";
                } else if (elements.length > 0) {
                    // Hide all elements with the class, not just the first one
                    for (let el of elements) {
                        el.style.display = "none";
                    }
                }
            }
        });
    }

    if (config.hideElementsId && config.hideElementsId.length > 0) {
        hideElements("id", config.hideElementsId);
    }

    if (config.hideElementsClass && config.hideElementsClass.length > 0) {
        hideElements("class", config.hideElementsClass);
    }
});

