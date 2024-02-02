document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');

    const baseUrl = 'http://localhost:8080';

    // Fetch tasks from the backend and display them
    const fetchAndDisplayTasks = async () => {
        try {
            const taskEndPoint = '/tasks'
            const apiUrl = `${baseUrl}${taskEndPoint}`;
            const response = await fetch(apiUrl);
            const tasks = await response.json();

            taskList.innerHTML = '';
            tasks.forEach(task => {
                console.log(typeof task);
                console.log(task);
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p><strong>Title:${task.title}</strong></p>
                    <p>Task Description:${task.description}</p>
                    <p>Due Date: ${task.dueDate}</p>
                    <p>Completed:${task.completed}</p>
                    <button class="editBtn btn" onclick="editTask(${task.id}, ${JSON.stringify(task)})">Edit</button>
                    <button class="deleteBtn btn" onclick="deleteTask(${task.id})">Delete</button>

                `;

                if (task.completed) {
                    listItem.classList.add('completed');
                }

                taskList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    // Add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById("title").value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const completed = document.getElementById('completed').checked;

        try {
            const taskEndPoint = '/add';
            const apiUrl = `${baseUrl}${taskEndPoint}`;
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    description,
                    dueDate,
                    completed
                }),
            });

            if (response.ok) {
                fetchAndDisplayTasks();
                taskForm.reset();
            } else {
                console.error('Failed to add task:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });

    // Edit a task
    window.editTask = async (taskId, task) => {
        // Implement the logic to fetch the task data by ID and populate the form for editing
        // Update the form action to perform an update instead of creating a new task  editTask  
        try {
            const taskEndPoint = '/task';
            const apiUrl = `${baseUrl}${taskEndPoint}/${taskId}`;
            console.log(apiUrl);
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
               
                body: JSON.stringify(task),
            });

            if (response.ok) {
                fetchAndDisplayTasks();
            }
            else {
                console.error('Failed to edit the task', response.statusText);
            }
        }
        catch (error) {
            console.error('Error updating  task:', error);
        }
    };

    // Delete a task
    window.deleteTask = async (taskId) => {
        try {
            const taskEndPoint = '/task';
            const apiUrl = `${baseUrl}${taskEndPoint}/${taskId}`;     // "http://localhost:8080/task/df9fe60a-ddb2-4d06-a3d3-038db1194e23
            const response = await fetch(apiUrl, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchAndDisplayTasks();
            } else {
                console.error('Failed to delete task:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    // Initial fetch and display tasks
    fetchAndDisplayTasks();
});
