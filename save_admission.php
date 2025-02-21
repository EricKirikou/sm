<?php
$servername = "localhost";
$username = "root";  // Change if needed
$password = "";  // Change if using a password
$dbname = "school_database"; // Ensure this matches your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// File upload handling
$target_dir = "uploads/";
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}
$picture = "";
if (isset($_FILES["picture"]) && $_FILES["picture"]["error"] == 0) {
    $file_name = time() . "_" . basename($_FILES["picture"]["name"]);
    $target_file = $target_dir . $file_name;

    if (move_uploaded_file($_FILES["picture"]["tmp_name"], $target_file)) {
        $picture = $target_file;
    } else {
        echo json_encode(["status" => "error", "message" => "Image upload failed."]);
        exit();
    }
}

// Retrieve form data
$student_name = $_POST['student_name'];
$registration_id = $_POST['registration_id'];
$admission_date = $_POST['admission_date'];
$class = $_POST['class'];
$fee_discount = $_POST['fee_discount'];
$mobile_number = $_POST['mobile_number'];
$birth_date = $_POST['birth_date'];
$gender = $_POST['gender'];
$birth_form_id = $_POST['birth_form_id'];
$previous_school = $_POST['previous_school'];
$religion = $_POST['religion'];
$address = $_POST['address'];
$guardian_name = $_POST['guardian_name'];
$guardian_contact = $_POST['guardian_contact'];
$orphan_status = $_POST['orphan_status'];
$father_name = $_POST['father_name'];
$father_contact = $_POST['father_contact'];
$father_occupation = $_POST['father_occupation'];
$mother_name = $_POST['mother_name'];
$mother_contact = $_POST['mother_contact'];
$mother_occupation = $_POST['mother_occupation'];

// Prepare SQL statement
$sql = "INSERT INTO admissions (student_name, registration_id, admission_date, class, fee_discount, mobile_number, birth_date, gender, birth_form_id, previous_school, religion, address, guardian_name, guardian_contact, orphan_status, father_name, father_contact, father_occupation, mother_name, mother_contact, mother_occupation, picture) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssssssssssssssss", $student_name, $registration_id, $admission_date, $class, $fee_discount, $mobile_number, $birth_date, $gender, $birth_form_id, $previous_school, $religion, $address, $guardian_name, $guardian_contact, $orphan_status, $father_name, $father_contact, $father_occupation, $mother_name, $mother_contact, $mother_occupation, $picture);

if ($stmt->execute()) {
    echo json_encode(["status" => "success", "message" => "Admission record saved successfully"]);
} else {
    echo json_encode(["status" => "error", "message" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
