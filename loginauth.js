document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", async function loginUser(event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        // ✅ Basic validation
        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        const loginData = {
            username: username, // ✅ Send username instead of email
            password: password,
        };

        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
                credentials: "include", // ✅ Let browser handle authentication cookies
            });

            const result = await response.json();
            if (response.ok) {
                alert("Login successful! Redirecting to dashboard...");
                window.location.href = "dashboard.html"; // Redirect after login
            } else {
                alert(result.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
