document.addEventListener("DOMContentLoaded", fetchStudents);

// 📌 Fetch and Display Students
async function fetchStudents(searchQuery = "") {
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/student/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch students.");

        const studentData = await response.json();
        const students = studentData.data || [];

        const studentGrid = document.getElementById("studentGrid");
        studentGrid.innerHTML = ""; // Clear previous data

        // "Add New" Card
        const addNewCard = document.createElement("div");
        addNewCard.className =
            "border-2 border-dashed border-blue-400 flex flex-col items-center justify-center p-6 rounded-lg cursor-pointer hover:bg-blue-50 transition";
        addNewCard.innerHTML = `<span class="text-blue-600 text-3xl">➕</span><p class="text-blue-600 font-semibold mt-2">Add New</p>`;
        addNewCard.onclick = openAddStudentModal;
        studentGrid.appendChild(addNewCard);

        // Generate Students Cards
        students.forEach(emp => {
            // if (searchQuery && !emp.firstName.toLowerCase().includes(searchQuery.toLowerCase())) {
            //     return;
            // }

            const card = document.createElement("div");
            card.className = "bg-white rounded-lg p-4 flex flex-col items-center text-center border";

            // Student Name
            const name = document.createElement("h3");
            name.className = "text-md font-semibold";
            name.innerText = emp.firstName || "Unknown Name";

            // Username
            const username = document.createElement("p");
            username.className = "text-gray-500 text-sm";
            username.innerText = `@${emp.username || "no_username"}`;

            card.append(name, username);
            studentGrid.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching students:", error);
    }
}

// 📌 Function to Open "Add Student" Modal
function openAddStudentModal() {
    window.location.href = "admissions.html";
}

// 🔍 Search Student
document.querySelector("input[placeholder='Search Student']").addEventListener("input", function () {
    fetchStudents(this.value);
});

// 📨 Send Update Request
async function sendUpdateRequest(id, updatedData) {
    try {
        const response = await fetch(`https://sukuu-backend.onrender.com/v1/api/student/edit/${id}`, {
            method: "PUT",
            body: JSON.stringify(updatedData),
            headers: { "Content-Type": "application/json" },
        });

        const result = await response.json();
        alert(result.message);

        fetchStudents(); // Refresh student list
    } catch (error) {
        console.error("Error updating Student:", error);
    }
}
