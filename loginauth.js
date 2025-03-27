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

                if (response.ok && result.access_token) {
                    console.log("✅ Login successful! Storing token...");

                    // 🔥 Store token in localStorage for future use
                    localStorage.setItem("access_token", result.access_token);

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
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🔄 Checking stored authentication token...");

    const token = localStorage.getItem("access_token");

    if (token) {
        console.log("✅ Token found! Verifying session...");

        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // 🔹 Use stored token for authentication
                },
                credentials: "include"
            });

            if (response.ok) {
                console.log("✅ User is authenticated! Redirecting...");
                window.location.href = "dashboard.html";  
            } else {
                console.log("❌ Token invalid or expired. Clearing storage...");
                localStorage.removeItem("access_token"); // Clear invalid token
            }
        } catch (error) {
            console.error("⚠️ Error checking login status:", error);
        }
    } else {
        console.log("❌ No stored token. User must log in.");
    }
});
