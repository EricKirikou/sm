document.addEventListener("DOMContentLoaded", fetchStudents);

// 📌 Fetch and Display Students
async function fetchStudents() {
    try {
        const studentGrid = document.getElementById("studentGrid");
        studentGrid.innerHTML = `
            <div class="col-span-full flex justify-center py-12">
                <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        `;

        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/student/", {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch students");

        const studentData = await response.json();
        const students = studentData.data || [];
        studentGrid.innerHTML = "";

        // "Add New Student" Card
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
            <p class="text-blue-600 font-medium text-lg">Add New Student</p>
            <p class="text-blue-400 text-sm mt-1">Click to create new profile</p>
        `;
        addNewCard.onclick = openAddStudentModal;
        studentGrid.appendChild(addNewCard);

        // Student Cards
        students.forEach(student => {
            const card = document.createElement("div");
            card.className = `
                bg-white rounded-xl p-5 flex flex-col items-center text-center border border-gray-200
                hover:shadow-md hover:border-blue-100 transition-all overflow-hidden
                relative min-h-[200px]
            `;

            const imageContainer = document.createElement("div");
            imageContainer.className = "relative mb-4";

            const initials = document.createElement("div");
            initials.className = "w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl";
            initials.textContent = student.name ? student.name.charAt(0).toUpperCase() : "?";

            const image = document.createElement("img");
            image.src = student.image || "";
            image.alt = student.name || "Student";
            image.className = "w-16 h-16 rounded-full object-cover absolute inset-0";
            image.onerror = () => {
                image.style.display = "none";
                initials.style.display = "flex";
            };
            image.style.display = student.image ? "block" : "none";
            initials.style.display = student.image ? "none" : "flex";

            imageContainer.append(image, initials);

            const name = document.createElement("h3");
            name.className = "text-lg font-semibold text-gray-800 mb-1";
            name.textContent = student.name || "Unknown Name";

            const username = document.createElement("p");
            username.className = "text-gray-500 text-sm mb-2";
            username.textContent = `@${student.username || "no_username"}`;

            const grade = document.createElement("p");
            grade.className = "text-sm px-3 py-1 rounded-full bg-green-100 text-green-800";
            grade.textContent = student.grade || "No Grade";

            const actions = document.createElement("div");
            actions.className = "flex gap-2 mt-auto pt-3 border-t border-gray-100 w-full justify-center";

            card.append(imageContainer, name, username, grade, actions);
            studentGrid.appendChild(card);
        });

        if (students.length === 0) {
            studentGrid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <div class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h3 class="text-lg font-medium text-gray-900">No students found</h3>
                    <p class="mt-1 text-gray-500">Add your first student to get started</p>
                    <button onclick="openAddStudentModal()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                        Add Student
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching students:", error);
        const studentGrid = document.getElementById("studentGrid");
        studentGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <div class="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h3 class="text-lg font-medium text-gray-900">Error loading students</h3>
                <p class="mt-1 text-gray-500">${error.message}</p>
                <button onclick="fetchStudents()" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Try Again
                </button>
            </div>
        `;
    }
}

// 📌 Function to Open "Add Student" Modal
function openAddStudentModal() {
    window.location.href = "add-student.html";
}
