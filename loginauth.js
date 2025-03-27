document.addEventListener("DOMContentLoaded", function () {
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

                // ✅ Fix: Extract token properly
                let token = result.access_token || (result.data && result.data.access_token);

                if (response.ok && token) {
                    console.log("✅ Token received:", token);

                    // Store token in a cookie
                    document.cookie = `access_token=${token}; path=/; SameSite=Lax; Secure`;

                    // ✅ Redirect after storing token
                    setTimeout(() => {
                        console.log("🔄 Redirecting to dashboard...");
                        window.location.href = "dashboard.html";  
                    }, 500);
                } else {
                    console.error("❌ Login failed. No token received.", result);
                    alert("Login failed. Please check your credentials.");
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
