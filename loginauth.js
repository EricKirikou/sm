// ====================================
// ✅ Authentication Check (Instant Redirect Before Load)
// ====================================
function getCookie(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(";");
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + "; path=/; SameSite=Lax" + expires;
}

function deleteCookie(name) {
    document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

// Restricted Pages Set
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

(function checkAuth() {
    const token = getCookie("access_token"); 
    const currentPage = window.location.pathname.split("/").pop();

    if (!token && restrictedPages.has(currentPage)) {
        window.location.replace("index.html");
    }
})();

// ====================================
// ✅ Login Function (Ensuring Network Visibility)
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
                // ✅ Login API Request (Visible in Network Tab)
                const response = await fetch("https://sukuu-backend.onrender.com/v1/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(loginData),
                    credentials: "include"
                });

                // ✅ Parse API Response
                const result = await response.json();

                if (response.ok) {
                    // ✅ Store login token & user data in cookies
                    setCookie("access_token", result.access_token, 7); 
                    setCookie("user_data", JSON.stringify(result.data), 7); 

                    // ✅ After login, redirect (BUT KEEP NETWORK REQUEST)
                    setTimeout(() => {
                        window.location.href = "dashboard.html";
                    }, 500); // Small delay so Network request remains visible
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
    // ✅ Logout Function (Keeps Network Activity)
    // ====================================
    const logoutButton = document.getElementById("logoutButton");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            deleteCookie("access_token"); 
            setTimeout(() => {
                window.location.href = "login.html";
            }, 500); // Small delay to keep Network request visible
        });
    }
});
