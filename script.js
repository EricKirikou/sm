document.getElementById("employeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const employeeId = document.getElementById("employeeId").value; // Track if updating
    const formData = new FormData();

    formData.append("name", document.getElementById("name").value);
    formData.append("staffID", document.getElementById("staffID").value);
    formData.append("phone", document.getElementById("phone").value);
    formData.append("dob", document.getElementById("dob").value);
    formData.append("role", document.getElementById("role").value);
    formData.append("salary", document.getElementById("salary").value);
    formData.append("gender", document.getElementById("gender").value);
    formData.append("email", document.getElementById("email").value);
    formData.append("experience", document.getElementById("experience").value);
    formData.append("education", document.getElementById("education").value);
    formData.append("address", document.getElementById("address").value);

    // Handle optional photo upload
    const photoFile = document.getElementById("photo").files[0];
    if (photoFile) {
        formData.append("photo", photoFile);
    }

    const method = employeeId ? "PUT" : "POST";
    const url = employeeId ? `http://localhost:5000/api/employees/${employeeId}` : "http://localhost:5000/api/employees";

    try {
        const response = await fetch(url, {
            method: method,
            body: formData
        });

        if (!response.ok) {
            throw new Error("Failed to save employee.");
        }

        document.getElementById("employeeForm").reset();
        document.getElementById("employeeId").value = ""; // Reset hidden input after update
        fetchEmployees(); // Refresh the employee list
    } catch (error) {
        console.error("Error saving employee:", error);
    }
});

// 🔄 Fetch Employees and Render Table
async function fetchEmployees() {
    try {
        const response = await fetch("http://localhost:5000/api/employees");
        const employees = await response.json();

        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = ""; // Clear existing content

        employees.forEach(emp => {
            const row = `
                <tr>
                    <td class="p-2">${emp.name}</td>
                    <td class="p-2">${emp.staffID}</td>
                    <td class="p-2">${emp.email}</td>
                    <td class="p-2">${new Date(emp.dob).toLocaleDateString()}</td>
                    <td class="p-2">${emp.role}</td>
                    <td class="p-2">${emp.phone}</td>
                    <td class="p-2">${emp.gender}</td>
                    <td class="p-2">${emp.address}</td>
                    <td class="p-2">${emp.education}</td>
                    <td class="p-2">${emp.experience}</td>
                    <td class="p-2">${emp.salary}</td>
                    <td class="p-2">
                        <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="editEmployee('${emp._id}')">Edit</button>
                        <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteEmployee('${emp._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
    }
}

async function editEmployee(id) {
    try {
        console.log("Fetching employee with ID:", id); // Debugging

        const response = await fetch(`http://localhost:5000/api/employees/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const emp = await response.json();
        console.log("Fetched Employee Data:", emp); // Debugging

        // Fill the form with employee data
        document.getElementById("employeeId").value = emp._id || "";
        document.getElementById("name").value = emp.name || "";
        document.getElementById("phone").value = emp.phone || "";
        document.getElementById("dob").value = emp.dob ? emp.dob.split("T")[0] : "";
        document.getElementById("role").value = emp.role || "";
        document.getElementById("salary").value = emp.salary || "";
        document.getElementById("gender").value = emp.gender || "";
        document.getElementById("email").value = emp.email || "";
        document.getElementById("experience").value = emp.experience || "";
        document.getElementById("education").value = emp.education || "";
        document.getElementById("address").value = emp.address || "";

        // Change button to "Update"
        const submitBtn = document.getElementById("submitButton");
        submitBtn.textContent = "Update";
        submitBtn.setAttribute("onclick", "updateEmployee()");

        console.log("Button changed to 'Update'"); // Debugging

    } catch (error) {
        console.error("Error fetching employee details:", error);
    }
}

async function updateEmployee() {
    try {
        const id = document.getElementById("employeeId").value;
        console.log("Updating Employee ID:", id); // Debugging

        const updatedData = {
            name: document.getElementById("name").value,
            phone: document.getElementById("phone").value,
            dob: document.getElementById("dob").value,
            role: document.getElementById("role").value,
            salary: document.getElementById("salary").value,
            gender: document.getElementById("gender").value,
            email: document.getElementById("email").value,
            experience: document.getElementById("experience").value,
            education: document.getElementById("education").value,
            address: document.getElementById("address").value,
        };

        console.log("Data Sent for Update:", updatedData); // Debugging

        const response = await fetch(`http://localhost:5000/api/employees/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        alert("Employee updated successfully!");
        fetchEmployees(); // Refresh the employee list

        // Reset form & button to "Save"
        document.getElementById("employeeForm").reset();
        const submitBtn = document.getElementById("submitButton");
        submitBtn.textContent = "Save";
        submitBtn.setAttribute("onclick", "saveEmployee()");

        console.log("Button reset to 'Save'"); // Debugging

    } catch (error) {
        console.error("Error updating employee:", error);
        alert("Failed to update employee.");
    }
}



// 🗑️ Delete Employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/employees/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to delete employee.");
        }
        fetchEmployees(); // Refresh after deletion
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
}

// Function to generate unique Staff ID (e.g., ST-20250304-001)
function generateStaffID() {
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
    const randomPart = Math.floor(100 + Math.random() * 900); // 3-digit random number
    return `ST-${datePart}-${randomPart}`;
}

// Set Staff ID on page load (only for new employees)
document.addEventListener("DOMContentLoaded", function () {
    const employeeIdField = document.getElementById("employeeId");
    const staffIdField = document.getElementById("staffID");

    if (!employeeIdField.value) { // Only generate if adding a new employee
        staffIdField.value = generateStaffID();
    }
});


// 🚀 Initial Load
fetchEmployees();
