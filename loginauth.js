// ==============================
// ✅ Session Storage Authentication (No Cookies, No Clearing Data)
// ==============================

// Function to set a token in sessionStorage
function setSessionToken(token) {
    sessionStorage.setItem("access_token", token);
}

// Function to get the stored token
function getSessionToken() {
    return sessionStorage.getItem("access_token");
}

// Function to remove the token (but does NOT clear other browser data)
function removeSessionToken() {
    sessionStorage.removeItem("access_token");
}

// ===============================
// ✅ Authentication Check (Restrict Pages)
// ===============================

function checkAuth() {
    const token = getSessionToken(); // Get token from sessionStorage
    const restrictedPages = [
        "dashboard.html", "account.html", "add-assets.html", "add-employee.html",
        "admissions.html", "ai-analytics.html", "applications.html", "attendance-list.html",
        "books.html", "calendar.html", "classes.html", "employee.html", "expense.html",
        "families.html", "fees.html", "hostel.html", "income.html", "institution-info.html",
        "invoices.html", "issued.html", "leave.html", "letters.html", "manage.html",
        "master-list.html", "media.html", "members.html", "message.html", "notice.html",
        "parents.html", "pay-salary.html", "payslip.html", "petty-cash.html", "shop-uniform.html",
        "students.html", "timetable.html", "transport.html", "visitor.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    // Redirect if user is not authenticated and trying to access a restricted page
    if (!token && restrictedPages.includes(currentPage)) {
        window.location.replace("index.html"); // Redirect instantly to index.html
    }
}

// Run authentication check when the page loads
document.addEventListener("DOMContentLoaded", checkAuth);

// ================================
// ✅ Login Function (Stores Response Cookies in Session Storage)
// ================================
async function loginUser(event) {
    event.preventDefault(); // Prevent form submission reload

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter both username and password.");
        return;
    }

    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    // Disable login button and show loader
    loginButton.disabled = true;
    loader.style.display = "block"; // Show loader

    const loginData = { username, password };

    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginData),
            credentials: "include" // Ensures cookies from backend are received
        });

        const result = await response.json();

        if (response.ok) {
            setSessionToken(result.access_token); // Store token in sessionStorage
            window.location.href = "dashboard.html"; // Redirect after login
        } else {
            alert(result.message || "Login failed. Please try again.");
            loginButton.disabled = false;
            loader.style.display = "none"; // Hide loader on failure
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again later.");
        loginButton.disabled = false;
        loader.style.display = "none"; // Hide loader on error
    }
}

// ================================
// ✅ Logout Function (Only Removes Session Token, No Browser Data Clearing)
// ================================
function logoutUser() {
    removeSessionToken(); // Only removes session token, keeps other data intact
    window.location.href = "login.html"; // Redirect to login page
}

// ================================
// ✅ Event Listeners
// ================================
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");

    if (loginButton) {
        loginButton.addEventListener("click", loginUser);
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", logoutUser);
    }
});
