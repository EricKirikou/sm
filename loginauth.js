// Function to set a cookie
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + "; path=/" + expires;
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
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// Authentication Check (Restrict Pages)
(function checkAuth() {
    const token = getCookie("authToken"); // Get token from cookies
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

    // Redirect if user is not authenticated and trying to access a restricted page
    if (!token && restrictedPages.includes(currentPage)) {
        window.location.replace("index.html"); // Redirect instantly to index.html
    }
})();

document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.createElement("div");  // Create a loader element
    loader.classList.add("loader"); // Add a loader class (styled in CSS)

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
            loginButton.innerHTML = `<div class="spinner-border text-light" role="status"></div> Logging in...`;

            const loginData = { username, password };

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                });

                const result = await response.json();
                if (response.ok) {
                    setCookie("authToken", result.token, 1); // Store token in cookie for 1 day
                    window.location.href = "dashboard.html"; // Redirect after login
                } else {
                    alert(result.message || "Login failed. Please try again.");
                    loginButton.innerHTML = "Log in"; // Reset button text
                    loginButton.disabled = false;
                }
            } catch (error) {
                console.error("Login error:", error);
                alert("An error occurred. Please try again later.");
                loginButton.innerHTML = "Log in"; // Reset button text
                loginButton.disabled = false;
            }
        });
    }

    // Logout Function
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            deleteCookie("authToken"); // Remove authentication cookie
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
