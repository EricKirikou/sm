document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");

    // Authentication Check (Restrict Pages)
    function checkAuth() {
        const token = localStorage.getItem("token");
        const restrictedPages = [
            "account.html",
            "add-assets.html",
            "add-employee.html",
            "admission_letter.html",
            "admissions.html",
            "ai-analytics.html",
            "ai-chatbot.html",
            "applications.html",
            "appointment_letter.html",
            "asset.html",
            "attendance-list.html",
            "books.html",
            "calendar.html",
            "class.html",
            "classes.html",
            "dashboard.html",
            "employee.html",
            "expense.html",
            "families.html",
            "fees-particulars.html",
            "fees.html",
            "gmeet.html",
            "hostel.html",
            "income.html",
            "institution-info.html",
            "invoices.html",
            "issued.html",
            "leave.html",
            "letter-ui.html",
            "letters.html",
            "manage.html",
            "master-list.html",
            "media.html",
            "members.html",
            "message.html",
            "notice.html",
            "parents.html",
            "pay-salary.html",
            "payslip.html",
            "petty-cash.html",
            "print-receipt.html",
            "promote_students.html",
            "purchase.html",
            "requisition-admin.html",
            "requistion.html",
            "result-card.html",
            "review.html",
            "rules-regulations.html",
            "settings.html",
            "shop-bookstation.html",
            "shop-uniform.html",
            "staff-attendance.html",
            "statement.html",
            "stud-attendance.html",
            "student_id.html",
            "students.html",
            "timetable.html",
            "transport.html",
            "visitor.html"
        ];

        const currentPage = window.location.pathname.split("/").pop();

        // Redirect if user is not authenticated and trying to access a restricted page
        if (!token && restrictedPages.includes(currentPage)) {
            window.location.href = "404-error.html"; // Redirect to 404 page
        }
    }

    checkAuth(); // Run the authentication check on page load

    // Login Functionality
    if (loginButton) {
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
    }

    // Logout Function
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "login.html"; // Redirect to login page
        });
    }
});
