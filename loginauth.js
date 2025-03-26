document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");

    loginButton.addEventListener("click", async function loginUser(event) {
        event.preventDefault(); // Prevent form submission reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        const loginData = {
            username: username,
            password: password,
        };

        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Login successful!");
                localStorage.setItem("token", result.token);
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
