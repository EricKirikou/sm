document.getElementById("admissionForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    try {
        const response = await fetch("http://localhost:5000/api/students", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});
