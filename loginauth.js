// ====================================
// ✅ Authentication Check (Instant Redirect)
// ====================================

// Function to get a cookie value
function getCookie(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

// Function to set a cookie (Persistent Storage)
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; SameSite=Lax" + expires;
}

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// Restricted Pages (Use Set for fast lookup)
const restrictedPages = new Set([
    "dashboard.html", "account.html", "add-assets.html", "add-employee.html",
    "admissions.html", "ai-analytics.html", "applications.html", "attendance-list.html",
    "books.html", "calendar.html", "classes.html", "employee.html", "expense.html",
    "families.html", "fees.html", "hostel.html", "income.html", "institution-info.html",
    "invoices.html", "issued.html", "leave.html", "letters.html", "manage.html",
    "master-list.html", "media.html", "members.html", "message.html", "notice.html",
    "parents.html", "pay-salary.html", "payslip.html", "petty-cash.html", "shop-uniform.html",
    "students.html", "timetable.html", "transport.html", "visitor.html"
]);

// Function to instantly check authentication **BEFORE** the page loads
(function checkAuth() {
    const token = getCookie("access_token"); // Get token from cookies
    const currentPage = window.location.pathname.split("/").pop();

    // Redirect IMMEDIATELY before the page loads if the user is unauthorized
    if (!token && restrictedPages.has(currentPage)) {
        window.location.replace("index.html");
    }
})();

// ====================================
// ✅ Login Function (Stores Data in Cookies)
// ====================================
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader"); // Ensure a loader exists in your HTML

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            // Disable login button and show loader
            loginButton.disabled = true;
            loader.style.display = "block";

            const loginData = { username, password };

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include"
                });

                const result = await response.json();

                if (response.ok) {
                    // Store token and user info in **cookies**
                    setCookie("access_token", result.access_token, 7); // Store token for 7 days
                    setCookie("user_data", JSON.stringify(result.data), 7); // Store user info for 7 days

                    // Redirect to dashboard immediately after login
                    window.location.href = "dashboard.html";
                } else {
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
    // ✅ Logout Function (Keeps Data Stored)
    // ====================================
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            deleteCookie("access_token"); // Remove only token (Keep user data)
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
