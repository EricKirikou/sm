document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent form from submitting

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
                    credentials: "include" // ✅ Allows browser to store cookies
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result);

                let token = result.access_token || (result.data && result.data.access_token);
                if (response.ok && token) {
                    console.log("✅ Token received:", token);

                    // ❌ Don't store manually, let the browser handle it
                    // document.cookie = `access_token=${token}; path=/; Secure; SameSite=None`;

                    console.log("🍪 Checking stored cookies:", document.cookie);

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

// 🚀 **Keep User Logged In After Refresh**
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🔄 Checking login status...");

    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
            method: "GET",
            credentials: "include" // ✅ Send stored cookies automatically
        });

        if (response.ok) {
            console.log("✅ User is authenticated! Redirecting...");
            setTimeout(() => {
                window.location.href = "dashboard.html";  
            }, 500);
        } else {
            console.log("❌ User not authenticated. Stay on login page.");
        }
    } catch (error) {
        console.error("⚠️ Error checking login status:", error);
    }
});
