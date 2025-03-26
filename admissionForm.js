document.getElementById("admissionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const data = {
        firstName: document.getElementById("firstName").value,
        otherName: document.getElementById("otherName").value,
        lastName: document.getElementById("lastName").value,
        admissionDate: document.getElementById("admissionDate").value,
        class: document.getElementById("class").value,
        mobile: document.getElementById("mobile").value,
        dob: document.getElementById("dob").value,
        gender: document.getElementById("gender").value,
        birthId: document.getElementById("birthId").value,
        fatherName: document.getElementById("fatherName").value,
        fatherContact: document.getElementById("fatherContact").value,
        motherName: document.getElementById("motherName").value,
        motherContact: document.getElementById("motherContact").value,
        medicalStatus: document.getElementById("medicalStatus").value,
        healthIssue: document.getElementById("medicalStatus").value === "Yes" 
                        ? document.getElementById("healthIssue").value 
                        : "",
    };
    try {
        const response = await fetch("https://sukuu-backend.onrender.com/v1/api/student/add", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});
