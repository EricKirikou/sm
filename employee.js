document.addEventListener("DOMContentLoaded", fetchEmployees);

// 📌 Fetch and Display Employees
async function fetchEmployees() {
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/");
        if (!response.ok) throw new Error("Failed to fetch employees.");

        const employeeData = await response.json();
        const employees = employeeData.data || [];

        const employeeGrid = document.getElementById("employeeGrid");
        employeeGrid.innerHTML = ""; // Clear previous data

        // "Add New" Card
        const addNewCard = document.createElement("div");
        addNewCard.className =
            "border-2 border-dashed border-blue-400 flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer hover:bg-blue-50 transition";
        addNewCard.innerHTML = `<span class="text-blue-600 text-3xl">➕</span><p class="text-blue-600 font-semibold mt-2">Add New</p>`;
        addNewCard.onclick = openAddEmployeeModal;
        employeeGrid.appendChild(addNewCard);

        // Generate Employee Cards
        employees.forEach(emp => {
            const card = document.createElement("div");
            card.className = "bg-white rounded-lg p-4 flex flex-col items-center text-center border";

            // Employee Image (Fallback to Default)
            const image = document.createElement("img");
            image.src = emp.imageOfEmployee || "https://via.placeholder.com/80";
            image.alt = "Profile";
            image.className = "w-20 h-20 rounded-full mb-3 object-cover";

            // Employee Name
            const name = document.createElement("h3");
            name.className = "text-md font-semibold";
            name.innerText = emp.nameOfEmployee || "Unknown Name";

            // Username
            const username = document.createElement("p");
            username.className = "text-gray-500 text-sm";
            username.innerText = `@${emp.username || "no_username"}`;

            // Role
            const role = document.createElement("p");
            role.className = "text-gray-600 text-sm font-bold mt-1";
            role.innerText = emp.role || "Unknown Role";

            // Action Buttons (View & Delete)
            const actions = document.createElement("div");
            actions.className = "flex gap-2 mt-3";

            card.append(image, name, username, role, actions);
            employeeGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching employees:", error);
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
