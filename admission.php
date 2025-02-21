<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = new mysqli("localhost", "root", "", "school_database");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Getting form data
    $student_name = $_POST['student_name'];
    $registration_id = $_POST['registration_id'];
    $admission_date = $_POST['admission_date'];
    $class = $_POST['class'];
    $mobile_number = $_POST['mobile_number'];
    
    // File upload handling
    $target_dir = "uploads/";
    $file_name = basename($_FILES["picture"]["name"]);
    $target_file = $target_dir . $file_name;
    
    if (move_uploaded_file($_FILES["picture"]["tmp_name"], $target_file)) {
        $image_path = $target_file; // Save path in DB

        // Insert into database
        $sql = "INSERT INTO admissions (student_name, registration_id, admission_date, class, mobile_number, picture) 
                VALUES ('$student_name', '$registration_id', '$admission_date', '$class', '$mobile_number', '$image_path')";

        if ($conn->query($sql) === TRUE) {
            echo "Admission record added successfully!";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } else {
        echo "Failed to upload the image.";
    }

    $conn->close();
}
?>
