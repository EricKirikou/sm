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

        const data = await response.json();
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = "";

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
            tableBody.innerHTML = `<tr><td colspan="12" class="text-center p-4">No employee data found</td></tr>`;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = `<tr><td colspan="12" class="text-center p-4 text-red-500">Error loading data</td></tr>`;
    }
}

// ✏️ Edit Employee
async function editEmployee(id) {
    const editBtn = document.querySelector(`button[onclick*="editEmployee('${id}')"]`);
    const originalBtnText = editBtn?.innerHTML;

    try {
        if (editBtn) {
            editBtn.disabled = true;
            editBtn.innerHTML = '<span class="animate-spin">⏳</span>';
        }

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, {
            credentials: "include",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch: ${response.status}`);
        }

        const { data } = await response.json();
        if (!data?._id) throw new Error("Invalid employee data");

        // Auto-fill form
        const fields = {
            'editEmployeeId': data._id,
            'editName': data.nameOfEmployee,
            'editStaffID': data.idNumber,
            'editPhone': data.mobileNumber,
            'editDob': data.dateOfBirth?.split('T')[0],
            'editRole': data.role,
            'editSalary': data.monthlySalary,
            'editGender': data.gender,
            'editEmail': data.email,
            'editExperience': data.experience,
            'editEducation': data.education,
            'editAddress': data.address
        };

        Object.entries(fields).forEach(([id, value]) => {
            const field = document.getElementById(id);
            if (field) field.value = value || '';
        });

        // Show popup
        document.getElementById("editPopup").classList.remove("hidden");
        document.body.classList.add("overflow-hidden");
        document.getElementById("editName")?.focus();

    } catch (error) {
        console.error("Edit error:", error);
        alert(`Error: ${error.message}`);
    } finally {
        if (editBtn) {
            editBtn.disabled = false;
            editBtn.innerHTML = originalBtnText || 'Edit';
        }
    }
}

// 🔄 Update Employee (Fixed to prevent duplicate submissions)
let isUpdating = false; // Flag to prevent duplicate submissions

async function updateEmployee() {
    if (window.isUpdating) return;
    window.isUpdating = true;
    
    const submitBtn = document.getElementById("updateEmployeeBtn");
    if (!submitBtn) {
        console.error("Submit button not found");
        window.isUpdating = false;
        return;
    }

    const originalBtnText = submitBtn.innerHTML;
    
    try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin">⏳</span> Updating...';

        // Get employee ID
        const id = document.getElementById("editEmployeeId")?.value;
        if (!id) throw new Error("No employee selected for update");

        // Prepare update data
        const updatedData = {
            nameOfEmployee: document.getElementById("editName")?.value.trim(),
            idNumber: document.getElementById("editStaffID")?.value.trim(),
            mobileNumber: document.getElementById("editPhone")?.value.trim(),
            dateOfBirth: document.getElementById("editDob")?.value,
            role: document.getElementById("editRole")?.value.trim(),
            monthlySalary: document.getElementById("editSalary")?.value.trim(),
            gender: document.getElementById("editGender")?.value,
            email: document.getElementById("editEmail")?.value.trim(),
            experience: document.getElementById("editExperience")?.value.trim(),
            education: document.getElementById("editEducation")?.value.trim(),
            address: document.getElementById("editAddress")?.value.trim()
        };

        // Validate required fields
        if (!updatedData.nameOfEmployee || !updatedData.email || !updatedData.role) {
            throw new Error("Name, Email and Role are required");
        }

        console.log("Sending update:", updatedData);

        // Send to backend
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/edit/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            },
            body: JSON.stringify(updatedData),
            credentials: "include"
        });

        // Handle null response
        const responseData = await response.json().catch(() => null);
        console.log("Update response:", {
            status: response.status,
            data: responseData
        });

        if (!response.ok || responseData === null) {
            throw new Error(responseData?.message || 
                          "Update failed - no data returned from server");
        }

        // Success handling (don't require specific success flag since backend returns null)
        alert("Employee updated successfully!");
        await fetchEmployees();
        closeEditPopup();

    } catch (error) {
        console.error("Update error:", error);
        alert(`Error: ${error.message}\n\nPlease check backend logs.`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        window.isUpdating = false;
    }
}
// 🗑️ Delete Employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, { 
            method: "DELETE",
            credentials: "include"
        });
        
        if (!response.ok) {
            throw new Error("Failed to delete employee");
        }
        
        await fetchEmployees();
        alert("Employee deleted successfully");
    } catch (error) {
        console.error("Error deleting employee:", error);
        alert(`Error: ${error.message}`);
    }
}

// 🏠 Modal Controls
function openEditPopup() {
    document.getElementById("editPopup").classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
}

function closeEditPopup() {
    document.getElementById("editPopup").classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
}

// 📷 Photo Preview
function previewEditPhoto(event) {
    const input = event.target;
    const preview = document.getElementById('editPhotoPreview');
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// 🚀 Initialize Application
function initializeApp() {
    // Set up form submission (only once)
    const editForm = document.getElementById("editEmployeeForm");
    if (editForm) {
        editForm.addEventListener("submit", (e) => {
            e.preventDefault();
            updateEmployee();
        });
    }

    // Load initial data
    fetchEmployees();
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);