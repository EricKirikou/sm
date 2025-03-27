document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("⚠️ Please enter both username and password.");
                return;
            }

            loginButton.disabled = true;
            loader.style.display = "block";

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include" // ✅ Allows browser to store HttpOnly cookies
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result);

                if (response.ok && result.data && result.access_token) {
                    console.log("✅ Login successful! Storing token in cookies...");

                    // ✅ Store token in cookies
                    document.cookie = `access_token=${result.access_token}; path=/; Secure; SameSite=None; Expires=${new Date(Date.now() + 86400000).toUTCString()}`;

                    console.log("🍪 Stored Cookies:", document.cookie);

                    // ✅ Redirect to dashboard
                    setTimeout(() => {
                        window.location.href = "dashboard.html";  
                    }, 500);
                } else {
                    console.error("❌ Login failed:", result.message);
                    alert(result.message || "Login failed. Please try again.");
                    loginButton.disabled = false;
                }
            } catch (error) {
                console.error("❌ Login error:", error);
                alert("⚠️ An error occurred. Please try again later.");
                loginButton.disabled = false;
            } finally {
                loader.style.display = "none";
            }
        });
    }
});

// 🚀 **Check User Login Status and Keep Them Logged In**
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Checking stored authentication token...");

    function getCookie(name) {
        let match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
        return match ? match[2] : null;
    }

    const token = getCookie("access_token");

    if (token) {
        console.log("✅ Token found! Redirecting...");
        window.location.href = "dashboard.html";  
    } else {
        console.log("❌ No stored token. User must log in.");
    }
});
