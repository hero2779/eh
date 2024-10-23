<?php
// Database connection parameters
$servername = "localhost";        // The MySQL server's address
$username = "myuser";             // The MySQL user
$password = "pickles";       // The MySQL password for the user
$dbname = "CPEG_Proj1_db";         // The MySQL database name

// Create a connection to the MySQL database
$conn = new mysqli($servername, $username, $password, $dbname);

// Check if the connection was successful
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: Set character set to handle UTF-8 encoding
$conn->set_charset("utf8mb4");

// Base URL for your website
define('BASE_URL', 'http://CPEG_Proj1.com/'); // Use your actual URL
?>
