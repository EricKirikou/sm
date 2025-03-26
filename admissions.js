document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("admissionForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
    fetchStudents();
});

// 📌 Handle Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();

    const firstNameField = document.getElementById("firstName");
    if (!firstNameField) {
        console.error("Error: Form fields not found!");
        return;
    }

    const data = {
        firstName: firstNameField.value,
        otherName: document.getElementById("otherName")?.value || "",
        lastName: document.getElementById("lastName")?.value || "",
        dateOfAdmission: document.getElementById("admissionDate")?.value || "",
        classGroup: document.getElementById("class")?.value || "",
        registrationID: document.getElementById("registrationId")?.value || "",
        mobileNumber: document.getElementById("mobile")?.value || "",
        gender: document.getElementById("gender")?.value || "",
        dateOfBirth: document.getElementById("dob")?.value || "",
        fatherName: document.getElementById("fatherName")?.value || "",
        fatherNumber: document.getElementById("fatherContact")?.value || "",
        motherName: document.getElementById("motherName")?.value || "",
        motherNumber: document.getElementById("motherContact")?.value || "",
        medicalCondition: document.getElementById("medicalStatus")?.value || "",
    };

    console.log("Submitting data:", data); // Debugging

    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/student/add", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await response.json();
        alert(result.message);
        form.reset();
        fetchStudents(); // Refresh the student list
    } catch (error) {
        console.error("Error saving student:", error);
    }
}


// 🔄 Fetch students and Render Table
async function fetchStudents() {
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/student/");
        if (!response.ok) throw new Error("Failed to fetch students.");

        const students = await response.json();
        const tableBody = document.querySelector("#studentTable tbody");
        tableBody.innerHTML = ""; // Clear existing content

        students.forEach(emp => {
            const row = `
                <tr>
                    <td class="p-2">${emp.firstName}</td>
                    <td class="p-2">${emp.otherName}</td>
                    <td class="p-2">${emp.lastName}</td>
                    <td class="p-2">${new Date(emp.dateOfAdmission).toLocaleDateString()}</td>
                    <td class="p-2">${emp.classGroup}</td>
                    <td class="p-2">${emp.registrationID}</td>
                    <td class="p-2">${emp.mobileNumber}</td>
                    <td class="p-2">${emp.gender}</td>
                    <td class="p-2">${new Date(emp.dateOfBirth).toLocaleDateString()}</td>
                    <td class="p-2">${emp.fatherName}</td>
                    <td class="p-2">${emp.fatherNumber}</td>
                    <td class="p-2">${emp.motherName}</td>
                    <td class="p-2">${emp.motherNumber}</td>
                    <td class="p-2">${emp.medicalCondition}</td>
                    <td class="p-2">
                        <button class="bg-blue-500 text-white px-3 py-1 rounded" onclick="editStudent('${emp._id}')">Edit</button>
                        <button class="bg-red-500 text-white px-3 py-1 rounded" onclick="deleteStudent('${emp._id}')">Delete</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// ✏️ Edit student
async function editStudent(id) {
    try {
        console.log("Fetching student with ID:", id);
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/student/${id}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const emp = await response.json();
        console.log("Fetched student Data:", emp);

        document.getElementById("studentId").value = emp._id || "";
        document.getElementById("firstName").value = emp.firstName || "";
        document.getElementById("otherName").value = emp.otherName || "";
        document.getElementById("lastName").value = emp.lastName || "";
        document.getElementById("mobile").value = emp.mobileNumber || "";
        document.getElementById("dob").value = emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "";
        document.getElementById("gender").value = emp.gender || "";
        document.getElementById("fatherName").value = emp.fatherName || "";
        document.getElementById("fatherContact").value = emp.fatherNumber || "";
        document.getElementById("motherName").value = emp.motherName || "";
        document.getElementById("motherContact").value = emp.motherNumber || "";
    } catch (error) {
        console.error("Error fetching student details:", error);
    }
}

// ❌ Delete student
async function deleteStudent(id) {
    try {
        const confirmDelete = confirm("Are you sure you want to delete this student?");
        if (!confirmDelete) return;

        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/student/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) throw new Error("Failed to delete student.");
        fetchStudents();
    } catch (error) {
        console.error("Error deleting student:", error);
    }
}

// 🚀 Initial Load
fetchStudents();
