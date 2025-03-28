document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");
    const loginText = document.getElementById("loginText");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            // Basic validation
            if (!username || !password) {
                alert("Please enter both username and password");
                return;
            }

            // Update UI for loading state
            loginButton.disabled = true;
            if (loginText) loginText.textContent = "Logging in...";
            loader.style.display = "flex"; // Show the circular loader
            
            // Record start time for minimum loading duration
            const startTime = Date.now();
            const minimumLoadTime = 5000; // 1.5 seconds minimum

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include" // Allows cookies to be set
                });

                const result = await response.json();
                console.log("🔹 Backend Response:", result);

                // Calculate remaining time to meet minimum duration
                const elapsed = Date.now() - startTime;
                const remainingTime = Math.max(0, minimumLoadTime - elapsed);

                await new Promise(resolve => setTimeout(resolve, remainingTime));

                if (result.data) {
                    window.location.href = "dashboard.html";
                } else {
                    console.error("❌ Login failed:", result.message);
                    alert(result.message || "Login failed. Please try again.");
                }
            } catch (error) {
                console.error("❌ Login error:", error);
                alert("⚠️ An error occurred. Please try again later.");
            } finally {
                // Reset UI
                loginButton.disabled = false;
                if (loginText) loginText.textContent = "Log in";
                loader.style.display = "none"; // Hide the loader
            }
        });
    }
});