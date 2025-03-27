document.addEventListener("DOMContentLoaded", async function () {
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const loader = document.getElementById("loader");
    
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

    const currentPage = window.location.pathname.split("/").pop();

    // ====================================
    // ✅ Authentication Check (Instant Redirect)
    // ====================================
    if (restrictedPages.has(currentPage)) {
        try {
            const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/me", {
                method: "GET",
                credentials: "include" // ✅ Let browser handle session
            });

            if (!response.ok) throw new Error("Not authenticated");
        } catch (error) {
            window.location.replace("index.html"); // ✅ Redirect instantly if unauthorized
        }
    }

    // ====================================
    // ✅ Login Process (Handles Everything)
    // ====================================
    if (loginButton) {
        loginButton.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (!username || !password) {
                alert("Please enter both username and password.");
                return;
            }

            loginButton.disabled = true;
            loader.style.display = "block"; // Show loader

            try {
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                    credentials: "include" // ✅ Browser handles cookies
                });

                if (response.ok) {
                    window.location.href = "dashboard.html"; // ✅ Redirect after login
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
    // ✅ Logout Process (No Manual Cookie Deletion)
    // ====================================
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            fetch("https://sukuu-backend.onrender.com/v1/api/auth/logout", {
                method: "POST",
                credentials: "include" // ✅ Backend invalidates session
            }).finally(() => {
                window.location.href = "login.html"; // ✅ Redirect after logout
            });
        });
    }
});
