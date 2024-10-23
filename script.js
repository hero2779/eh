document.querySelector("#add-task").addEventListener("click", addTask);

// On page load, fetch tasks from the backend
window.addEventListener("load", () => {
    fetch('api.php')
        .then(response => response.text()) // First, get the raw response as text
        .then(text => {
            console.log('Raw response from API:', text); // Log the raw response for debugging
            return JSON.parse(text); // Parse JSON if possible
        })
        .then(tasks => {
            tasks.forEach(task => {
                displayTask(task.id, task.content, task.completed);
            });
        })
        .catch(error => console.error('Error:', error)); // Catch any errors
});


// Function to add a new task
function addTask() {
    const taskContent = document.getElementById("task-input").value;

    if (taskContent.trim() === "") {
        return; // Don't add empty tasks
    }

    // Create the task on the server via the API
    fetch('api.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            content: taskContent
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Task added successfully") {
            const taskId = data.task_id;
            displayTask(taskId, taskContent, false); // Add task to the DOM
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to display tasks in the DOM
function displayTask(id, content, completed) {
    const TaskList = document.getElementById("todo-list");

    const taskItem = document.createElement("div");
    taskItem.classList.add("task-item");

    const taskContent = document.createElement("div");
    taskContent.textContent = content;
    taskItem.dataset.taskId = id; // Store task ID for reference

    if (completed) {
        taskContent.style.textDecoration = "line-through";
    }

    // "Complete Task" button
    const completeButton = document.createElement("button");
    completeButton.textContent = "Completed Task";
    completeButton.addEventListener("click", () => {
        const taskId = taskItem.dataset.taskId; // Get the task ID
        const isCompleted = taskContent.style.textDecoration === "line-through";

        fetch('api.php', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId,
                content: taskContent.textContent,
                completed: !isCompleted ? 1 : 0
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Task updated successfully") {
                taskContent.style.textDecoration = !isCompleted ? "line-through" : "none";
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // "Delete Task" button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Task";
    deleteButton.addEventListener("click", () => {
        const taskId = taskItem.dataset.taskId;

        fetch('api.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: taskId
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Task deleted successfully") {
                TaskList.removeChild(taskItem); // Remove task from DOM
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // "Edit Task" button
    const editButton = document.createElement("button");
    editButton.textContent = "Edit Task";
    editButton.addEventListener("click", () => {
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.value = taskContent.textContent;

        taskItem.replaceChild(editInput, taskContent);
        editInput.focus();

        editInput.addEventListener("blur", () => {
            const newText = editInput.value.trim();
            const taskId = taskItem.dataset.taskId;

            if (newText !== "") {
                fetch('api.php', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: taskId,
                        content: newText,
                        completed: taskContent.style.textDecoration === "line-through" ? 1 : 0
                    }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === "Task updated successfully") {
                        taskContent.textContent = newText;
                        taskItem.replaceChild(taskContent, editInput);
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });

        editInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                editInput.blur();
            }
        });
    });

    // Append content and buttons to the task item
    taskItem.appendChild(taskContent);
    taskItem.appendChild(completeButton);
    taskItem.appendChild(deleteButton);
    taskItem.appendChild(editButton);

    // Append the task item to the task list
    TaskList.appendChild(taskItem);
}
