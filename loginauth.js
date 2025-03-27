// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}; path=/; SameSite=Lax; Secure${expires}`;
}

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

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

// Authentication Check (Restrict Pages)
(function checkAuth() {
    const token = getCookie("access_token");
    const restrictedPages = [
        "account.html", "add-assets.html", "add-employee.html", "admission_letter.html", "admissions.html",
        "ai-analytics.html", "ai-chatbot.html", "applications.html", "appointment_letter.html", "asset.html",
        "attendance-list.html", "books.html", "calendar.html", "class.html", "classes.html", "dashboard.html",
        "employee.html", "expense.html", "families.html", "fees-particulars.html", "fees.html", "gmeet.html",
        "hostel.html", "income.html", "institution-info.html", "invoices.html", "issued.html", "leave.html",
        "letter-ui.html", "letters.html", "manage.html", "master-list.html", "media.html", "members.html",
        "message.html", "notice.html", "parents.html", "pay-salary.html", "payslip.html", "petty-cash.html",
        "print-receipt.html", "promote_students.html", "purchase.html", "requisition-admin.html", "requistion.html",
        "result-card.html", "review.html", "rules-regulations.html", "settings.html", "shop-bookstation.html",
        "shop-uniform.html", "staff-attendance.html", "statement.html", "stud-attendance.html", "student_id.html",
        "students.html", "timetable.html", "transport.html", "visitor.html"
    ];

    const currentPage = window.location.pathname.split("/").pop();

    // Check if user just logged in
    const bypassAuth = sessionStorage.getItem("bypassAuth");
    if (bypassAuth) {
        sessionStorage.removeItem("bypassAuth"); // Remove flag after redirection
        return; // Skip restriction check
    }

    // Redirect if user is not authenticated and trying to access a restricted page
    if (!token && restrictedPages.includes(currentPage)) {
        alert("You need to log in first!");
        window.location.replace("index.html");
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader"); // Ensure there's a loader in your HTML

    if (loginButton) {
        loginButton.addEventListener("click", async function loginUser(event) {
            event.preventDefault(); // Prevent form submission reload

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            // Disable login button and show loader
            loginButton.disabled = true;
            loader.style.display = "block"; // Show loader

            const loginData = { username, password };

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include"
                });

                const result = await response.json();
                console.log("Full Response:", result); // Debugging - log full response

                // Check where the token is stored in response
                const token = result.access_token || result.data?.access_token;
                
                if (response.ok && token) {
                    setCookie("access_token", token, 1); // Store token in cookie for 1 day
                    sessionStorage.setItem("bypassAuth", "true"); // Allow dashboard access temporarily
                    window.location.replace("dashboard.html"); // Redirect after login
                } else {
                    alert(result.message || "Login failed. Please try again.");
                    loginButton.disabled = false;
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred. Please try again later.");
                loginButton.disabled = false;
            } finally {
                loader.style.display = "none"; // Hide loader on success/failure
            }
        });
    }
    
    // Logout Function
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            deleteCookie("access_token"); // Remove authentication cookie
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
