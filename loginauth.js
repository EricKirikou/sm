document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.getElementById("loginButton");
    const signupButton = document.getElementById("signupButton");
    const logoutButton = document.getElementById("logoutButton");
    const loader = document.getElementById("loader");

    const publicPages = new Set(["index.html", "login.html", "signup.html"]); // Pages accessible without login
    const currentPage = window.location.pathname.split("/").pop() || "index.html"; // Default to index.html

    // ====================================
    // ✅ Authentication Check (Redirect Unauthenticated Users)
    // ====================================
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
            method: "GET",
            credentials: "include"
        });

        if (!response.ok) throw new Error("Not authenticated");

        // ✅ If user is authenticated but on login/signup/index, redirect to dashboard
        if (publicPages.has(currentPage)) {
            window.location.replace("dashboard.html");
        }
    } catch (error) {
        // 🚀 If user is NOT authenticated and trying to access a restricted page, redirect to index.html
        if (!publicPages.has(currentPage)) {
            window.location.replace("index.html");
        }
    }

    // ====================================
    // ✅ Login Process
    // ====================================
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
            loader.style.display = "block"; // Show loader

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include"
                });

                if (response.ok) {
                    window.location.href = "dashboard.html"; // ✅ Redirect after login
                } else {
                    const result = await response.json();
                    alert(result.message || "Login failed. Please try again.");
                    loginButton.disabled = false;
                    loader.style.display = "none";
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred. Please try again later.");
                loginButton.disabled = false;
                loader.style.display = "none";
            }
        });
    }

    // ====================================
    // ✅ Signup Process
    // ====================================
    if (signupButton) {
        signupButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const username = document.getElementById("signup-username").value.trim();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value.trim();

            if (!username || !email || !password) {
                alert("Please fill in all fields.");
                return;
            }

            signupButton.disabled = true;
            loader.style.display = "block"; // Show loader

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                    credentials: "include"
                });

                if (response.ok) {
                    alert("Signup successful! You can now log in.");
                    window.location.href = "login.html"; // ✅ Redirect to login page after signup
                } else {
                    const result = await response.json();
                    alert(result.message || "Signup failed. Please try again.");
                    signupButton.disabled = false;
                    loader.style.display = "none";
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("An error occurred. Please try again later.");
                signupButton.disabled = false;
                loader.style.display = "none";
            }
        });
    }

    // ====================================
    // ✅ Logout Process
    // ====================================
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch("https://sukuu-backend.onrender.com/v1/api/auth/logout", {
                method: "POST",
                credentials: "include"
            }).finally(() => {
                window.location.href = "index.html"; // ✅ Redirect to index.html after logout
            });
        });
    }
});
