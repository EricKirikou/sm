// 🔄 Fetch Employees and Render Table
async function fetchEmployees() {
    try {
        // Show loading state
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = `
            <tr>
                <td colspan="12" class="py-8 text-center">
                    <div class="flex justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    <p class="mt-2 text-gray-600">Loading employees...</p>
                </td>
            </tr>
        `;

        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        tableBody.innerHTML = "";

        if (data && data.data && Array.isArray(data.data)) {
            data.data.forEach(emp => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 transition-colors duration-150';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span class="text-blue-600 font-medium">${emp.nameOfEmployee?.charAt(0) || '?'}</span>
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${emp.nameOfEmployee || '-'}</div>
                                <div class="text-sm text-gray-500">${emp.email || '-'}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            ${emp.idNumber || 'N/A'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColorClass(emp.role)}">
                            ${emp.role || 'Unassigned'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${emp.mobileNumber || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${emp.gender || '-'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        ${emp.address || '-'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${emp.education || '-'}
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-500">
                        ${emp.experience || '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${emp.monthlySalary ? formatGhanaCedis(emp.monthlySalary) : '-'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div class="flex space-x-2">
                            <button onclick="editEmployee('${emp._id}')" class="text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                            <button onclick="deleteEmployee('${emp._id}')" class="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="12" class="px-6 py-8 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No employees found</h3>
                        <p class="mt-1 text-sm text-gray-500">Get started by adding a new employee.</p>
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = `
            <tr>
                <td colspan="12" class="px-6 py-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 class="mt-2 text-sm font-medium text-gray-900">Error loading data</h3>
                    <p class="mt-1 text-sm text-gray-500">${error.message}</p>
                    <button onclick="fetchEmployees()" class="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Retry
                    </button>
                </td>
            </tr>
        `;
    }
}

// Helper function to format Ghana Cedis
function formatGhanaCedis(amount) {
    return new Intl.NumberFormat('en-GH', {
        style: 'currency',
        currency: 'GHS',
        minimumFractionDigits: 2
    }).format(amount);
}

// Helper function for role badge colors
function getRoleColorClass(role) {
    switch(role) {
        case 'Accountant': return 'bg-purple-100 text-purple-800';
        case 'Teacher': return 'bg-blue-100 text-blue-800';
        case 'Librarian': return 'bg-yellow-100 text-yellow-800';
        case 'Head Master': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

// Helper function for role badge colors
function getRoleColorClass(role) {
    switch(role) {
        case 'Accountant': return 'bg-purple-100 text-purple-800';
        case 'Teacher': return 'bg-blue-100 text-blue-800';
        case 'Librarian': return 'bg-yellow-100 text-yellow-800';
        case 'Head Master': return 'bg-indigo-100 text-indigo-800';
        default: return 'bg-gray-100 text-gray-800';
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
// 🗑️ Delete Employee (Final Working Version)
async function deleteEmployee(id) {
    if (!id) {
        console.error("No employee ID provided");
        return;
    }

    if (!confirm("Are you sure you want to permanently delete this employee?")) {
        return;
    }

    const deleteBtn = document.querySelector(`button[onclick*="deleteEmployee('${id}')"]`);
    const originalBtnText = deleteBtn?.innerHTML;
    const loader = document.getElementById("loader");

    try {
        // UI Loading States
        if (deleteBtn) {
            deleteBtn.disabled = true;
            deleteBtn.innerHTML = '<span class="animate-spin">⏳</span> Deleting...';
        }
        if (loader) loader.style.display = "flex";

        // API Request - Note the updated endpoint with /delete/
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/delete/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token') || ''}`
            },
            credentials: "include"
        });

        // Debugging logs
        console.log("DELETE Response Status:", response.status);
        
        // Handle response
        const result = await response.json().catch(() => ({}));
        console.log("DELETE Response Data:", result);

        if (!response.ok) {
            throw new Error(result.message || `Deletion failed with status ${response.status}`);
        }

        // Verify the message matches expected response
        if (!result.message || !result.message.includes("successfully")) {
            throw new Error("Unexpected response format from server");
        }

        // Refresh data and show success
        await fetchEmployees();
        showToast(result.message || "Employee deleted successfully", "success");

    } catch (error) {
        console.error("Delete error:", error);
        showToast(`Failed to delete: ${error.message}`, "error");
        
        // Detailed error diagnostics
        console.group("DELETE Error Diagnostics");
        console.log("Employee ID:", id);
        console.log("Auth Token Present:", !!localStorage.getItem('token'));
        console.log("Endpoint:", `https://sukuu-backend.onrender.com/v1/api/employee/delete/${id}`);
        console.groupEnd();
        
    } finally {
        // Reset UI
        if (deleteBtn) {
            deleteBtn.disabled = false;
            deleteBtn.innerHTML = originalBtnText || 'Delete';
        }
        if (loader) loader.style.display = "none";
    }
}

// 🍞 Toast Notification Helper (if not already implemented)
function showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-md shadow-lg text-white ${
        type === "error" ? "bg-red-500" : 
        type === "success" ? "bg-green-500" : "bg-blue-500"
    }`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add("opacity-0", "transition-opacity", "duration-300");
        setTimeout(() => toast.remove(), 300);
    }, 3000);
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