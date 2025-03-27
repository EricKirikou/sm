// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}; path=/; SameSite=Lax; Secure${expires}`;
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

// Function to delete a cookie (only used for logout)
function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader"); // Ensure there's a loader in your HTML

    if (loginButton) {
        loginButton.addEventListener("click", async function loginUser(event) {
            event.preventDefault(); // Prevent form submission reload

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            // Disable login button and show loader
            loginButton.disabled = true;
            loader.style.display = "block"; // Show loader

            const loginData = { username, password };

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include"
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result); // Debugging - log full response

                // Extract token from response
                const token = result.access_token || result.data?.access_token;

                if (response.ok && token) {
                    console.log("✅ Token received:", token);
                    setCookie("access_token", token, 1); // Store token in cookie for 1 day
                    sessionStorage.setItem("bypassAuth", "true"); // Allow access temporarily

                    // Ensure all token data is stored before redirection
                    setTimeout(() => {
                        window.location.replace("dashboard.html"); // Redirect to dashboard
                    }, 500); // Short delay to ensure data storage
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
                loader.style.display = "none"; // Hide loader on success/failure
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
