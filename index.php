<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    header("Location: register.html"); // Redirect to login if not logged in
    exit();
}
// Proceed to show the to-do list page (HTML and JS) for logged-in users
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do List</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <h1>To-Do List for <?php echo $_SESSION['username']; ?></h1>
  
  <!-- The rest of your to-do list HTML -->
  <div id="todo-list"></div>
  <input type="text" id="task-input" placeholder="Add New Task">
  <button id="add-task">Add Task</button>

  <a href="logout.php">Logout</a>
  
  <script type="module" src="script.js"></script>
</body>
</html>
