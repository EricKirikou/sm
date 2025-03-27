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

// 🚀 **Auto-redirect if already logged in**
document.addEventListener("DOMContentLoaded", function () {
    const token = getCookie("access_token");

    if (token) {
        console.log("✅ Token found! Redirecting to dashboard...");
        window.location.href = "dashboard.html";
        return;
    }

    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

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

                    // ✅ Redirect to dashboard after storing the token
                    setTimeout(() => {
                        console.log("🔄 Redirecting to dashboard...");
                        window.location.href = "dashboard.html";
                    }, 500);
                } else {
                    console.error("❌ Login failed:", result.message);
                    alert(result.message || "Login failed. Please try again.");
                    loginButton.disabled = false;
                }
            } catch (error) {
                console.error("❌ Login error:", error);
                alert("An error occurred. Please try again later.");
                loginButton.disabled = false;
            } finally {
                loader.style.display = "none";
            }
        });
    }
});
