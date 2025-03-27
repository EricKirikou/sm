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

                    // ✅ Redirect to dashboard if login was successful
                    setTimeout(() => {
                        window.location.href = "dashboard.html";  
                    }, 500);
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

// 🚀 **Check User Login Status and Keep Them Logged In**
document.addEventListener("DOMContentLoaded", async function () {
    console.log("🔄 Checking stored authentication token in cookies...");

    function getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    }

    const token = getCookie("access_token"); // ✅ Get token from cookies

    if (token) {
        console.log("✅ Token found in cookies! Verifying session...");

        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}` // ✅ Use cookie token for authentication
                },
                credentials: "include"
            });

            if (response.ok) {
                console.log("✅ User is authenticated! Redirecting...");
                window.location.href = "dashboard.html";  
            } else {
                console.log("❌ Token invalid or expired. Clearing cookies...");
                document.cookie = "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Secure; SameSite=Lax";
            }
        } catch (error) {
            console.error("⚠️ Error checking login status:", error);
        }
    } else {
        console.log("❌ No stored token in cookies. User must log in.");
    }
});
