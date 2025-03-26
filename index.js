document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".tab-btn");
    const contents = document.querySelectorAll(".tab-content");
    const underline = document.getElementById("underline");

    if (tabs.length > 0) {
        tabs.forEach((tab, index) => {
            tab.addEventListener("click", function () {
                // Remove active class from all tabs
                tabs.forEach(btn => btn.classList.remove("text-white"));
                // Hide all tab contents
                contents.forEach(content => content.classList.add("hidden"));

                // Show selected content
                document.getElementById(this.getAttribute("data-tab")).classList.remove("hidden");

                // Move underline
                underline.style.left = `${this.offsetLeft}px`;
                underline.style.width = `${this.offsetWidth}px`;

                // Highlight active tab
                this.classList.add("text-white");
            });
        });

        // Set initial underline position
        const firstTab = tabs[0];
        underline.style.left = `${firstTab.offsetLeft}px`;
        underline.style.width = `${firstTab.offsetWidth}px`;
    }

    // Check if the user has accepted cookies
    if (!localStorage.getItem("cookieConsent")) {
        createConsentPopup();
    }

    function createConsentPopup() {
        const consentPopup = document.createElement("div");
        consentPopup.innerHTML = `
            <div id="cookie-popup" style="position: fixed; bottom: 0; left: 0; width: 100%; background: white; color: black; padding: 20px; text-align: center; box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.2); font-family: Arial, sans-serif;">
                <p style="margin-bottom: 15px; font-size: 16px;">We use cookies to track visitors, measure ads, ad campaign effectiveness, and analyze site traffic. For more info, see our <a href="/cookie-policy" style="color: #DCC336; text-decoration: underline;">Cookie Policy</a> and <a href="privacy.html" style="color: #DCC336; text-decoration: underline;">Privacy Policy</a>.</p>
                <div style="display: flex; justify-content: center; gap: 20px;">
                    <button id="accept-cookies" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">Accept all</button>
                    <button id="cookie-preferences" style="padding: 10px 20px; background: #ddd; color: black; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: 0.3s;">Preferences</button>
                </div>
            </div>
        `;
        document.body.appendChild(consentPopup);

        document.getElementById("accept-cookies").onclick = function() {
            localStorage.setItem("cookieConsent", JSON.stringify({
                strictlyNecessary: true,
                functional: true,
                performance: true,
                targeting: true
            }));
            document.getElementById("cookie-popup").remove();
        };

        document.getElementById("cookie-preferences").onclick = function() {
            showPreferencesPopup();
        };
    }

    function showPreferencesPopup() {
        let preferencePopup = document.createElement("div");
        preferencePopup.innerHTML = `
            <div id="preferences-popup" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 400px; background: white; padding: 20px; border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3); font-family: Arial, sans-serif;">
                <h2 style="text-align: center; margin-bottom: 15px;">Privacy Preferences</h2>
                <p style="font-size: 14px; text-align: center; margin-bottom: 10px;">Manage your cookie preferences below.</p>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <label><input type="checkbox" id="strictlyNecessary" checked disabled> Strictly Necessary Cookies</label>
                    <label><input type="checkbox" id="functional"> Functional Cookies</label>
                    <label><input type="checkbox" id="performance"> Performance Cookies</label>
                    <label><input type="checkbox" id="targeting"> Targeting Cookies</label>
                </div>
                <div style="text-align: center; margin-top: 15px;">
                    <button id="save-preferences" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">Confirm My Choices</button>
                </div>
            </div>
        `;
        document.body.appendChild(preferencePopup);

        // Load existing preferences
        let savedPreferences = JSON.parse(localStorage.getItem("cookieConsent"));
        if (savedPreferences) {
            document.getElementById("functional").checked = savedPreferences.functional;
            document.getElementById("performance").checked = savedPreferences.performance;
            document.getElementById("targeting").checked = savedPreferences.targeting;
        }

        // Save user preferences
        document.getElementById("save-preferences").onclick = function() {
            let newPreferences = {
                strictlyNecessary: true,
                functional: document.getElementById("functional").checked,
                performance: document.getElementById("performance").checked,
                targeting: document.getElementById("targeting").checked
            };
            localStorage.setItem("cookieConsent", JSON.stringify(newPreferences));
            document.getElementById("preferences-popup").remove();
            document.getElementById("cookie-popup").remove();
        };
    }
});
