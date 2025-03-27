document.addEventListener("DOMContentLoaded", function () {
    const signupButton = document.getElementById("signupButton");
    if (signupButton) {
        signupButton.addEventListener("click", async function (event) {
            event.preventDefault();

            const username = document.getElementById("signupUsername").value.trim();
            const password = document.getElementById("signupPassword").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            signupButton.disabled = true;

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include"
                });

                const result = await response.json();

                if (response.ok) {
                    alert("Signup successful! You can now log in.");
                    window.location.href = "login.html";
                } else {
                    alert(result.message || "Signup failed. Try again.");
                    signupButton.disabled = false;
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("An error occurred. Try again.");
                signupButton.disabled = false;
            }
        });
    }
});
