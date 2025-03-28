document.addEventListener("DOMContentLoaded", fetchEmployees);

// 📌 Fetch and Display Employees
async function fetchEmployees() {
    try {
        // Show loading state
        const employeeGrid = document.getElementById("employeeGrid");
        employeeGrid.innerHTML = `
            <div class="col-span-full flex justify-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;

        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch employees");

        const employeeData = await response.json();
        const employees = employeeData.data || [];
        employeeGrid.innerHTML = "";

        // "Add New" Card - Enhanced Design
        const addNewCard = document.createElement("div");
        addNewCard.className = `
            border-2 border-dashed border-blue-400 rounded-xl p-6 flex flex-col items-center justify-center 
            cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-sm
            group min-h-[200px]
        `;
        addNewCard.innerHTML = `
            <div class="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3
                        group-hover:bg-blue-200 transition-colors">
                <span class="text-blue-600 text-2xl">+</span>
            </div>
            <p class="text-blue-600 font-medium text-lg">Add New Employee</p>
            <p class="text-blue-400 text-sm mt-1">Click to create new profile</p>
        `;
        addNewCard.onclick = openAddEmployeeModal;
        employeeGrid.appendChild(addNewCard);

        // Generate Employee Cards
        employees.forEach(emp => {
            const card = document.createElement("div");
            card.className = `
                bg-white rounded-xl p-5 flex flex-col items-center text-center border border-gray-200
                hover:shadow-md hover:border-blue-100 transition-all overflow-hidden
                relative min-h-[200px]
            `;

            // Employee Image with Fallback to Initials
            const imageContainer = document.createElement("div");
            imageContainer.className = "relative mb-4";
            
            const initials = document.createElement("div");
            initials.className = "w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl";
            initials.textContent = emp.nameOfEmployee ? emp.nameOfEmployee.charAt(0).toUpperCase() : "?";
            
            const image = document.createElement("img");
            image.src = emp.imageOfEmployee || "";
            image.alt = emp.nameOfEmployee || "Employee";
            image.className = "w-16 h-16 rounded-full object-cover absolute inset-0";
            image.onerror = () => {
                image.style.display = "none";
                initials.style.display = "flex";
            };
            image.style.display = emp.imageOfEmployee ? "block" : "none";
            initials.style.display = emp.imageOfEmployee ? "none" : "flex";
            
            imageContainer.append(image, initials);

            // Employee Full Name
            const name = document.createElement("h3");
            name.className = "text-lg font-semibold text-gray-800 mb-1";
            name.textContent = emp.nameOfEmployee || "Unknown Name";

            // Username (exactly as in your original)
            const username = document.createElement("p");
            username.className = "text-gray-500 text-sm mb-2";
            username.textContent = `@${emp.username || "no_username"}`;

            // Role Badge (enhanced styling)
            const role = document.createElement("p");
            role.className = "text-sm px-3 py-1 rounded-full " + getRoleColorClass(emp.role);
            role.textContent = emp.role || "Unassigned Role";

            // Action Buttons
            const actions = document.createElement("div");
            actions.className = "flex gap-2 mt-auto pt-3 border-t border-gray-100 w-full justify-center";
          

            card.append(imageContainer, name, username, role, actions);
            employeeGrid.appendChild(card);
        });

        // If no employees found
        if (employees.length === 0) {
            employeeGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">No employees found</h3>
                    <p class="mt-1 text-gray-500">Add your first employee to get started</p>
                    <button onclick="openAddEmployeeModal()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Add Employee
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching employees:", error);
        const employeeGrid = document.getElementById("employeeGrid");
        employeeGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Error loading employees</h3>
                <p class="mt-1 text-gray-500">${error.message}</p>
                <button onclick="fetchEmployees()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Try Again
                </button>
            </div>
        `;
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

// 📌 Function to Open "Add Employee" Modal
function openAddEmployeeModal() {
    window.location.href = "add-employee.html";
}


// 🔍 Search Employee
document.querySelector("input[placeholder='Search Employee']").addEventListener("input", function () {
    fetchEmployees(this.value);
});

// ✏️ Edit Employee - Populate Form
async function editEmployee(id) {
    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`);
        if (!response.ok) throw new Error("Failed to fetch employee data.");

        const empData = await response.json();
        const emp = empData.data;

        document.getElementById("editEmployeeId").value = emp._id;
        document.getElementById("editName").value = emp.nameOfEmployee;
        document.getElementById("editStaffID").value = emp.idNumber || "N/A";
        document.getElementById("editRole").value = emp.role;
        document.getElementById("editPhone").value = emp.mobileNumber;
        document.getElementById("editSalary").value = emp.monthlySalary;
        document.getElementById("editGender").value = emp.gender;
        document.getElementById("editEducation").value = emp.education;
        document.getElementById("editExperience").value = emp.experience;
        document.getElementById("editEmail").value = emp.email;
        document.getElementById("editDob").value = emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "";
        document.getElementById("editAddress").value = emp.address;

        // Show employee image if available
        const photoPreview = document.getElementById("editPhotoPreview");
        if (emp.imageOfEmployee) {
            photoPreview.src = emp.imageOfEmployee;
        } else {
            photoPreview.src = "default-avatar.png"; // Default placeholder image
        }

        document.getElementById("editPopup").classList.remove("hidden");

    } catch (error) {
        console.error("Error fetching employee details:", error);
    }
}

// 📤 Update Employee
async function updateEmployee() {
    const id = document.getElementById("editEmployeeId").value;

    const updatedData = {
        nameOfEmployee: document.getElementById("editName").value,
        mobileNumber: document.getElementById("editPhone").value,
        role: document.getElementById("editRole").value,
        monthlySalary: document.getElementById("editSalary").value,
        gender: document.getElementById("editGender").value,
        education: document.getElementById("editEducation").value,
        experience: document.getElementById("editExperience").value,
        email: document.getElementById("editEmail").value,
        dateOfBirth: document.getElementById("editDob").value,
        address: document.getElementById("editAddress").value
    };

    // Handle photo upload if changed
    const photoFile = document.getElementById("editPhoto").files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            updatedData.imageOfEmployee = event.target.result; // Convert image to Base64
            sendUpdateRequest(id, updatedData);
        };
        reader.readAsDataURL(photoFile);
    } else {
        sendUpdateRequest(id, updatedData);
    }
}

// 📨 Send Update Request
async function sendUpdateRequest(id, updatedData) {
    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/edit/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        alert(result.message);

        closeEditPopup();
        fetchEmployees(); // Refresh employee list
    } catch (error) {
        console.error("Error updating employee:", error);
    }
}

// 🖼️ Preview Profile Photo
function previewEditPhoto(event) {
    const photoPreview = document.getElementById("editPhotoPreview");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            photoPreview.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// ❌ Delete Employee
async function deleteEmployee(id) {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete employee.");

        fetchEmployees(); // Refresh employee list
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
}

// 🔄 Close Edit Popup
function closeEditPopup() {
    document.getElementById("editPopup").classList.add("hidden");
    document.getElementById("editPhotoPreview").src = ""; // Clear image preview
}
