// ====================================
// ✅ Authentication Check (Redirect Immediately if Unauthorized)
// ====================================
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

(async function checkAuth() {
    try {
        // ✅ Check auth from the backend using credentials (Cookies are sent automatically)
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
            method: "GET",
            credentials: "include" // Browser sends stored cookies automatically
        });

        if (!response.ok) {
            throw new Error("Not authenticated");
        }

        // ✅ User is authenticated, do nothing
    } catch (error) {
        const currentPage = window.location.pathname.split("/").pop();
        if (restrictedPages.has(currentPage)) {
            window.location.replace("index.html"); // Redirect immediately
        }
    }
})();

// ====================================
// ✅ Login Process (No Manual Token Storage)
// ====================================
document.addEventListener("DOMContentLoaded", function () {
    const loginButton = document.getElementById("loginButton");
    const loader = document.getElementById("loader");

    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            // Show loading state
            loginButton.disabled = true;
            loader.style.display = "block";

            const loginData = { username, password };

            try {
                // ✅ Login API Request (Browser stores token automatically)
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include" // Browser handles authentication
                });

                if (response.ok) {
                    // ✅ Redirect to dashboard after login
                    window.location.href = "dashboard.html";
                } else {
                    const result = await response.json();
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
    // ✅ Logout Function (No Cookie Deletion)
    // ====================================
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            // ✅ Backend handles session removal, but cookies remain
            fetch("https://sukuu-backend.onrender.com/v1/api/auth/logout", {
                method: "POST",
                credentials: "include" // Let browser handle cookies
            }).finally(() => {
                window.location.href = "login.html"; // Redirect after logout
            });
        });
    }
});
