<?php
session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(["message" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];
$request_method = $_SERVER['REQUEST_METHOD'];
$conn = new mysqli('localhost', 'myuser', 'pickles', 'CPEG_Proj1_db');

switch ($request_method) {
    case 'GET':
        get_tasks($user_id);
        break;
    case 'POST':
        add_task($user_id);
        break;
    case 'PUT':
        update_task($user_id);
        break;
    case 'DELETE':
        delete_task($user_id);
        break;
    default:
        echo json_encode(["message" => "Invalid request method"]);
        break;
}

function get_tasks($user_id) {
    global $conn;
    $result = $conn->query("SELECT id, content, completed FROM tasks WHERE user_id = $user_id");
    $tasks = $result->fetch_all(MYSQLI_ASSOC);
    echo json_encode($tasks);
}

function add_task($user_id) {
    global $conn;
    $input = json_decode(file_get_contents("php://input"), true);
    $content = $input['content'];

    $stmt = $conn->prepare("INSERT INTO tasks (content, completed, user_id) VALUES (?, 0, ?)");
    $stmt->bind_param("si", $content, $user_id);

    if ($stmt->execute()) {
                echo json_encode([
            "message" => "Task added successfully",
            "task_id" => $conn->insert_id
        ]);
    } else {
        echo json_encode(["message" => "Error adding task"]);
    }

    $stmt->close();
}

function update_task($user_id) {
    global $conn;
    $input = json_decode(file_get_contents("php://input"), true);
    $task_id = $input['id'];
    $content = $input['content'];
    $completed = $input['completed'];

    $stmt = $conn->prepare("UPDATE tasks SET content = ?, completed = ? WHERE id = ? AND user_id = ?");
    $stmt->bind_param("siii", $content, $completed, $task_id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Task updated successfully"]);
    } else {
        echo json_encode(["message" => "Error updating task"]);
    }

    $stmt->close();
}

function delete_task($user_id) {
    global $conn;
    $input = json_decode(file_get_contents("php://input"), true);
    $task_id = $input['id'];

    $stmt = $conn->prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $task_id, $user_id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Task deleted successfully"]);
    } else {
        echo json_encode(["message" => "Error deleting task"]);
    }

    $stmt->close();
}
?>

