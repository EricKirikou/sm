document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            loginButton.disabled = true;
            loader.style.display = "block";

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include" // Allows cookies to be set
                });

                const result = await response.json();
                console.log("🔹 Backend Response:", result);

                if (result.data) {
                    // console.log("✅ Login successful! Storing token...");

                    // // ✅ Store token in cookies (instead of localStorage)
                    // document.cookie = `access_token=${result.token}; Path=/; Secure; HttpOnly;`;

                    // ✅ Redirect only if password is correct
                        window.location.href = "dashboard.html";
                } else {
                    console.error("❌ Login failed:", result.message);
                    alert(result.message || "Login failed. Please try again.");
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

// 🚀 **Check if User is Logged In**
// document.addEventListener("DOMContentLoaded", async function () {
//     console.log("🔄 Checking stored authentication token...");

//     const token = getCookie("access_token");

//     if (token) {
//         console.log("✅ Token found! Verifying session...");

//         try {
//             const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
//                 method: "GET",
//                 headers: { "Authorization": `Bearer ${token}` },
//                 credentials: "include"
//             });

//             if (response.ok) {
//                 console.log("✅ User is authenticated! Redirecting...");
//                 window.location.href = "dashboard.html";  
//             } else {
//                 console.log("❌ Token invalid or expired. Clearing cookies...");
//                 document.cookie = "access_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // Clear cookie
//             }
//         } catch (error) {
//             console.error("⚠️ Error checking login status:", error);
//         }
//     } else {
//         console.log("❌ No stored token. User must log in.");
//     }
// });

// 🔍 **Helper Function: Get Cookie**
// function getCookie(name) {
//     const cookies = document.cookie.split("; ");
//     for (let cookie of cookies) {
//         let [key, value] = cookie.split("=");
//         if (key === name) return value;
//     }
//     return null;
// }
