document.addEventListener("DOMContentLoaded", function () {
    const signupButton = document.getElementById("signupButton");

    signupButton.addEventListener("click", async function registerUser(event) {
        event.preventDefault(); // Prevent page reload

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const termsCheckbox = document.getElementById("termsCheckbox");

        // ✅ Basic validation
        if (!username || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (!termsCheckbox.checked) {
            alert("You must accept the Terms & Conditions.");
            return;
        }

        const signupData = {
            username: username, // ✅ Send username instead of email
            password: password,
        };

        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(signupData),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Signup successful! Redirecting to login...");
                window.location.href = "login.html"; // Redirect after signup
            } else {
                alert(result.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("An error occurred. Please try again later.");
        }
    });
});
