document.addEventListener("DOMContentLoaded", async function () {
    const token = getCookie("access_token");

    if (!token) {
        console.log("🚨 No token found, redirecting to login...");
        window.location.href = "login.html";
        return;
    }

    console.log("✅ Token found, fetching dashboard data...");

    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,  // Pass token in headers
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();
        console.log("📊 Dashboard Data:", result);

        if (response.ok) {
            document.getElementById("dashboardContent").innerHTML = `
                <h2>Welcome, ${result.user.name}!</h2>
                <p>Email: ${result.user.email}</p>
                <p>Role: ${result.user.role}</p>
            `;
        } else {
            console.error("❌ Failed to fetch dashboard data:", result.message);
            document.getElementById("dashboardContent").innerHTML = "<p>Error loading dashboard.</p>";
        }
    } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        document.getElementById("dashboardContent").innerHTML = "<p>Error fetching data.</p>";
    }
});

// Function to get cookies (Same function as in login)
function getCookie(name) {
    let nameEQ = name + "=";
    let cookiesArray = document.cookie.split(";");
    for (let cookie of cookiesArray) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

// Logout Function
document.getElementById("logoutButton").addEventListener("click", function () {
    deleteCookie("access_token");
    window.location.href = "login.html";
});

// Function to delete a cookie
function deleteCookie(name) {
    document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}
