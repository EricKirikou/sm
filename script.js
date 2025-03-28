// Employee Form Submission for Adding New Employees Only
document.getElementById("employeeForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    
    // Get form data
    const data = {
        nameOfEmployee: document.getElementById("name").value.trim(),
        mobileNumber: document.getElementById("phone").value.trim(),
        dateOfBirth: document.getElementById("dob").value,
        role: document.getElementById("role").value.trim(),
        monthlySalary: document.getElementById("salary").value.trim(),
        gender: document.getElementById("gender").value,
        email: document.getElementById("email").value.trim(),
        experience: document.getElementById("experience").value.trim(),
        education: document.getElementById("education").value.trim(),
        address: document.getElementById("address").value.trim(),
        legalContactName: document.getElementById("fatherName").value.trim()
    };

    // Simple validation
    if (!data.nameOfEmployee || !data.email || !data.role) {
        alert("Please fill in all required fields (Name, Email, Role)");
        return;
    }

    // Show loading state
    const submitBtn = document.querySelector("#employeeForm button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Adding...";

    try {
        // Send data to server
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/employee/add", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include"
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to add employee");
        }

        const result = await response.json();
        alert(result.message || "Employee added successfully!");
        
        // Reset form after successful submission
        document.getElementById("employeeForm").reset();
        
    } catch (error) {
        console.error("Error adding employee:", error);
        alert(`Error: ${error.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Employee";
    }
});

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Reset form when page loads
    document.getElementById("employeeForm").reset();
});