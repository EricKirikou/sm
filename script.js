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
        showMessage("Please fill in all required fields (Name, Email, Role)", "error");
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
        showMessage(result.message || "Employee added successfully!", "success");
        
        // Reset form after successful submission
        document.getElementById("employeeForm").reset();
        
    } catch (error) {
        console.error("Error adding employee:", error);
        showMessage(`Error: ${error.message}`, "error");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Add Employee";
    }
});

// Initialize form
document.addEventListener('DOMContentLoaded', function() {
    // Reset form when page loads
    document.getElementById("employeeForm").reset();
    
    // Add the message container to the DOM if it doesn't exist
    if (!document.getElementById('message-container')) {
        const messageContainer = document.createElement('div');
        messageContainer.id = 'message-container';
        document.body.appendChild(messageContainer);
    }
});

// Function to show styled messages
function showMessage(message, type) {
    const messageContainer = document.getElementById('message-container') || createMessageContainer();
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    messageContainer.appendChild(messageElement);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => messageElement.remove(), 500);
    }, 5000);
}

function createMessageContainer() {
    const container = document.createElement('div');
    container.id = 'message-container';
    document.body.appendChild(container);
    return container;
}