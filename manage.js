
// 🔄 Fetch Employees and Render Table
async function fetchEmployees() {
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = ""; // Clear existing content

        // Check if data exists and has the expected structure
        if (data && data.data && Array.isArray(data.data)) {
            data.data.forEach(emp => {
                const row = `
                    <tr>
                        <td class="p-2">${emp.nameOfEmployee || '-'}</td>
                        <td class="p-2">${emp.idNumber || '-'}</td>
                        <td class="p-2">${emp.email || '-'}</td>
                        <td class="p-2">${emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : '-'}</td>
                        <td class="p-2">${emp.role || '-'}</td>
                        <td class="p-2">${emp.mobileNumber || '-'}</td>
                        <td class="p-2">${emp.gender || '-'}</td>
                        <td class="p-2">${emp.address || '-'}</td>
                        <td class="p-2">${emp.education || '-'}</td>
                        <td class="p-2">${emp.experience || '-'}</td>
                        <td class="p-2">${emp.monthlySalary || '-'}</td>
                        <td class="p-2">
                            <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="editEmployee('${emp._id}')">Edit</button>
                            <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteEmployee('${emp._id}')">Delete</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            console.error("Unexpected data structure:", data);
            tableBody.innerHTML = `<tr><td colspan="12" class="text-center p-4">No employee data found or invalid data structure</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = `<tr><td colspan="12" class="text-center p-4 text-red-500">Error loading employee data: ${error.message}</td></tr>`;
    }
}

async function editEmployee(id) {
    try {
        console.log("Fetching employee with ID:", id); // Debugging

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`);
        
        // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const empData = await response.json();
        console.log("Fetched Employee Data:", empData); // Debugging

        const emp = empData.data; // Ensure correct data extraction

        // Fill modal form with employee data
        document.getElementById("editEmployeeId").value = emp._id || "";
        document.getElementById("editName").value = emp.nameOfEmployee || "";
        document.getElementById("editStaffID").value = emp.idNumber || "";
        document.getElementById("editPhone").value = emp.mobileNumber || "";
        document.getElementById("editDob").value = emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "";
        document.getElementById("editRole").value = emp.role || "";
        document.getElementById("editSalary").value = emp.monthlySalary || "";
        document.getElementById("editGender").value = emp.gender || "";
        document.getElementById("editEmail").value = emp.email || "";
        document.getElementById("editExperience").value = emp.experience || "";
        document.getElementById("editEducation").value = emp.education || "";
        document.getElementById("editAddress").value = emp.address || "";

        // Show the modal
        document.getElementById("editPopup").classList.remove("hidden");

        console.log("Form populated successfully!"); // Debugging

    } catch (error) {
        console.error("Error fetching employee details:", error);
    }
}


function openEditPopup() {
    document.getElementById("editPopup").classList.remove("hidden");
}

function closeEditPopup() {
    document.getElementById("editPopup").classList.add("hidden");
}


async function updateEmployee() {
    try {
        const id = document.getElementById("editEmployeeId").value;
        console.log("Updating Employee ID:", id); // Debugging

        const updatedData = {
            nameOfEmployee: document.getElementById("editName").value,
            idNumber: document.getElementById("editStaffID").value, // Readonly, unchanged
            mobileNumber: document.getElementById("editPhone").value,
            dateOfBirth: document.getElementById("editDob").value,
            role: document.getElementById("editRole").value,
            monthlySalary: document.getElementById("editSalary").value,
            gender: document.getElementById("editGender").value,
            email: document.getElementById("editEmail").value,
            experience: document.getElementById("editExperience").value,
            education: document.getElementById("editEducation").value,
            address: document.getElementById("editAddress").value,
        };

        console.log("Data Sent for Update:", updatedData); // Debugging

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        alert("Employee updated successfully!");
        fetchEmployees(); // Refresh the employee list

        // ✅ Close the modal after updating
        closeEditPopup();

    } catch (error) {
        console.error("Error updating employee:", error);
        alert("Failed to update employee.");
    }
}





// 🗑️ Delete Employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, { method: "DELETE" });
        if (!response.ok) {
            throw new Error("Failed to delete employee.");
        }
        fetchEmployees(); // Refresh after deletion
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
}


// 🚀 Initial Load
fetchEmployees();
