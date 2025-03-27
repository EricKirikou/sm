// Function to set a cookie (Permanent Storage)
function setCookie(name, value) {
    document.cookie = `${name}=${value}; path=/; SameSite=Lax; Secure`;
}

// Function to get a cookie value
function getCookie(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(";");
    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

// Function to delete a cookie (Only for logout)
function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

// 🚀 **Auto-redirect to dashboard if already logged in**
document.addEventListener("DOMContentLoaded", function () {
    const token = getCookie("access_token");

    if (token) {
        console.log("✅ Token found! Redirecting to dashboard...");
        window.location.href = "dashboard.html"; // Redirect if token exists
        return;
    }

    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent form submission reload

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                return; // Do nothing if fields are empty
            }

            // Disable login button and show loader
            loginButton.disabled = true;
            loader.style.display = "block";

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include"
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result);

                if (response.ok && result.access_token) {
                    console.log("✅ Token received:", result.access_token);
                    setCookie("access_token", result.access_token); // Store token permanently

                    // ✅ Redirect to dashboard **only after** token is stored
                    setTimeout(() => {
                        console.log("🔄 Redirecting to dashboard...");
                        window.location.href = "dashboard.html";
                    }, 500); // Short delay to ensure storage completion
                } else {
                    console.error("❌ Login failed:", result.message);
                    loginButton.disabled = false;
                }
            } catch (error) {
                console.error("❌ Login error:", error);
                loginButton.disabled = false;
            } finally {
                loader.style.display = "none"; // Hide loader
            }
        });
    }

    // Logout Function
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            deleteCookie("access_token"); // Remove authentication cookie
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
