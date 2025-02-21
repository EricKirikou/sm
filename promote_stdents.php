<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "school_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $student_ids = $_POST['student_ids']; 
    $new_program = $_POST['new_program']; 

    foreach ($student_ids as $id) {
        $sql = "UPDATE students SET program='$new_program' WHERE student_id='$id'";
        $conn->query($sql);
    }

    echo json_encode(["status" => "success"]);
}

$conn->close();
?>
