document.getElementById("employeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const employeeId = document.getElementById("employeeId").value; // Track if updating
    const data = {
        nameOfEmployee: document.getElementById("name").value,
        mobileNumber: document.getElementById("phone").value,
        dateOfBirth: document.getElementById("dob").value,
        role: document.getElementById("role").value,
        monthlySalary: document.getElementById("salary").value,
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value,
        experience: document.getElementById("experience").value,
        education: document.getElementById("education").value,
        address: document.getElementById("address").value,
        legalContactName: document.getElementById("fatherName").value,
    }

    // Handle optional photo upload
    const photoFile = document.getElementById("photo").files[0];
    if (photoFile) {
        data.imageOfEmployee = photoFile;
    }

    const method = employeeId ? "PUT" : "POST";
    const url = employeeId
        ? `https://sukuu-backend.onrender.com/v1/api/employee/edit/${employeeId}`
        : "https://sukuu-backend.onrender.com/v1/api/employee/add";

    try {

        const response = await fetch(url, {
            method: method,
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();

        alert(result.message);

        document.getElementById("employeeForm").reset();
        document.getElementById("employeeId").value = ""; // Reset hidden input after update
        if (employeeId) {
            fetchEmployees(); // Refresh the employee list
        }
    } catch (error) {
        console.error("Error saving employee:", error);
    }
});

// 🔄 Fetch Employees and Render Table
async function fetchEmployees() {
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/");
        if (!response.ok) throw new Error("Failed to fetch employees.");

        const employees = await response.json();
        const tableBody = document.querySelector("#employeeTable tbody");
        tableBody.innerHTML = ""; // Clear existing content

        employees.forEach(emp => {
            const row = `
                <tr>
                    <td class="p-2">${emp.nameOfEmployee}</td>
                    <td class="p-2">${emp.idNumber}</td>
                    <td class="p-2">${emp.email}</td>
                    <td class="p-2">${new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                    <td class="p-2">${emp.role}</td>
                    <td class="p-2">${emp.mobileNumber}</td>
                    <td class="p-2">${emp.gender}</td>
                    <td class="p-2">${emp.address}</td>
                    <td class="p-2">${emp.education}</td>
                    <td class="p-2">${emp.experience}</td>
                    <td class="p-2">${emp.monthlySalary}</td>
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

// ✏️ Edit Employee
async function editEmployee(id) {
    try {
        console.log("Fetching employee with ID:", id); // Debugging

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const emp = await response.json();
        console.log("Fetched Employee Data:", emp); // Debugging

        // Fill the form with employee data
        document.getElementById("employeeId").value = emp._id || "";
        document.getElementById("name").value = emp.nameOfEmployee || "";
        document.getElementById("phone").value = emp.mobileNumber || "";
        document.getElementById("dob").value = emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "";
        document.getElementById("role").value = emp.role || "";
        document.getElementById("salary").value = emp.monthlySalary || "";
        document.getElementById("gender").value = emp.gender || "";
        document.getElementById("email").value = emp.email || "";
        document.getElementById("experience").value = emp.experience || "";
        document.getElementById("education").value = emp.education || "";
        document.getElementById("address").value = emp.address || "";
        document.getElementById("fatherName").value = emp.legalContactName || "";

        // Show employee image if available
        if (emp.imageOfEmployee) {
            const photoPreview = document.getElementById("photoPreview");
            photoPreview.src = emp.imageOfEmployee;
            photoPreview.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error fetching employee details:", error);
    }
}

// ❌ Delete Employee
async function deleteEmployee(id) {
    try {
        const confirmDelete = confirm("Are you sure you want to delete this employee?");
        if (!confirmDelete) return;

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/employee/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete employee.");

        fetchEmployees(); // Refresh table after deletion
    } catch (error) {
        console.error("Error deleting employee:", error);
    }
}

// 🚀 Initial Load
fetchEmployees();
