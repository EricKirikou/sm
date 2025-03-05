document.addEventListener("DOMContentLoaded", loadStaff);

// Function to load employees into dropdown
async function loadStaff() {
    try {
        const response = await fetch("http://localhost:5000/api/employees");
        const employees = await response.json();
        let dropdown = document.getElementById("staffDropdown");

        employees.forEach(employee => {
            let option = document.createElement("option");
            option.value = employee.staffID; // Only storing staff ID
            option.textContent = `${employee.name} - ${employee.staffID}`;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading staff:", error);
    }
}

// Function to generate letter and redirect with staff ID
function generateLetter() {
    let selectedStaffID = document.getElementById("staffDropdown").value;
    if (!selectedStaffID) {
        alert("Please select a staff member.");
        return;
    }

    // Debugging Step: Check if staffID is selected
    console.log("Selected Staff ID:", selectedStaffID);

    // Redirect with staffID in URL
    window.location.href = `letter-ui.html?id=${selectedStaffID}`;
}

async function populateLetter() {
    const staffID = getQueryParam("id");
    if (!staffID) {
        console.error("No Staff ID found in URL.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/employees/${staffID}`);
        if (!response.ok) throw new Error("Failed to fetch staff data");

        const data = await response.json();
        console.log("Fetched Staff Data:", data); // Debugging  

        // Ensure elements exist before assigning values
        document.getElementById("staffName").textContent = data.name || "N/A";
        document.getElementById("staffID").textContent = data.staffID || "N/A";
        document.getElementById("staffRole").textContent = data.role || "N/A";
        document.getElementById("staffName2").textContent = data.name || "N/A";
        document.getElementById("medicalDate").textContent = data.medicalDate || "N/A";
        document.getElementById("reportingTime").textContent = data.reportingTime || "N/A";
        document.getElementById("address").textContent = data.address || "N/A";

        // Handle the photo if available
        if (data.photoURL) {
            let photoElement = document.getElementById("staffPhoto");
            photoElement.src = data.photoURL;
            photoElement.style.display = "block"; // Show the photo
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Run after the page loads
document.addEventListener("DOMContentLoaded", populateLetter);


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("letterContent")) {
        console.log("Letter UI detected. Populating details...");
        populateLetter();
    }
});

