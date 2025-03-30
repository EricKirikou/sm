document.addEventListener("DOMContentLoaded", async function () {
    const token = getCookie("access_token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Immediately set loading state
    const usernameElement = document.getElementById("sidebarUsername");
    if (usernameElement) usernameElement.textContent = "Loading...";

    try {
        // 1. First try to get fresh data from API
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            credentials: 'include'
        });

        if (!response.ok) throw new Error("API request failed");

        const result = await response.json();
        
        // Priority order for username:
        // 1. API response (username or nameOfEmployee)
        // 2. Existing cookie
        // 3. Fallback "User"
        const userName = extractUsername(result) || getCookie("username") || "User";
        
        // Update UI immediately
        updateUsername(userName);
        
        // Store in cookie for future visits
        setCookie("username", userName, 1);

    } catch (error) {
        console.error("Fetch error:", error);
        // Fallback to cookie if API fails
        const userName = getCookie("username") || "User";
        updateUsername(userName);
    }
});

// Helper function to reliably extract username from API response
function extractUsername(apiResponse) {
    if (!apiResponse || !apiResponse.user) return null;
    
    // Check all possible username fields
    return apiResponse.user.username || 
           apiResponse.user.nameOfEmployee || 
           apiResponse.user.email?.split('@')[0] || 
           null;
}

// Update the UI with the username
function updateUsername(username) {
    const usernameElement = document.getElementById("sidebarUsername");
    if (usernameElement) {
        usernameElement.textContent = username;
        usernameElement.style.fontWeight = "600"; // Make it stand out
    }
    
    // Also update dashboard if exists
    const dashboardElement = document.getElementById("dashboardContent");
    if (dashboardElement) {
        dashboardElement.innerHTML = `<h2>Welcome, ${username}!</h2>`;
    }
}

// Cookie functions (optimized)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}