document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault();

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
                    credentials: "include" // 🔹 Ensures browser stores response cookies
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result);

                // ✅ Store access_token from network response in cookies manually
                let token = result.access_token || (result.data && result.data.access_token);
                if (response.ok && token) {
                    console.log("✅ Token received:", token);

                    // Explicitly set cookie with secure attributes
                    document.cookie = `access_token=${token}; path=/; Secure; SameSite=Lax; Max-Age=86400`;

                    console.log("🍪 Stored Cookies:", document.cookie);

                    // ✅ Redirect after successful login
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

// 🚀 Keep User Logged In After Refresh
document.addEventListener("DOMContentLoaded", function () {
    console.log("🔄 Checking stored cookies on page load...");
    
    const cookies = document.cookie;
    console.log("🍪 Current Cookies:", cookies);

    if (cookies.includes("access_token")) {
        console.log("✅ User already logged in! Redirecting...");
        setTimeout(() => {
            window.location.href = "dashboard.html"; // Redirect if token exists
        }, 500);
    } else {
        console.log("⚠️ No token found in cookies.");
    }
});
