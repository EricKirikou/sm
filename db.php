<?php
$host = "localhost";
$user = "your_username";
$password = "your_password";
$database = "school_database";

$conn = new mysqli($host, $user, $password, $database);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
