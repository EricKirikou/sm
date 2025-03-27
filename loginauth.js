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

                if (response.ok && result.access_token) {
                    console.log("✅ Token received:", result.access_token);

                    // Store token in a cookie
                    document.cookie = `access_token=${result.access_token}; path=/; SameSite=Lax; Secure`;

                    // ✅ Force reload to ensure redirect
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
