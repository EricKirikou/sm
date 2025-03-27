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
                    credentials: "include"
                });

                const result = await response.json();
                console.log("🔹 Full Response:", result);

                if (response.ok && result.token) {
                    console.log("✅ Login successful! Storing token in cookies...");

                    // 🔥 Store token in cookies (Valid for 1 day)
                    document.cookie = `access_token=${result.token}; Path=/; Secure; SameSite=Lax; Max-Age=86400`;

                    // ✅ Redirect to dashboard based on correct password
                    if (result.user) {
                        console.log("🔓 Password correct. Redirecting...");
                        setTimeout(() => {
                            window.location.href = "dashboard.html";  
                        }, 500);
                    } else {
                        console.error("❌ Incorrect password.");
                        alert("❌ Incorrect password. Please try again.");
                        loginButton.disabled = false;
                    }
                } else {
                    console.error("❌ Login failed:", result.message);
                    alert("❌ Incorrect username or password. Please try again.");
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
