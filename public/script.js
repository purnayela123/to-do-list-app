document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
  
    const fetchTasks = async () => {
      const response = await fetch('/tasks');
      const tasks = await response.json();
      taskList.innerHTML = '';
      tasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task.title;
        if (task.completed) {
          li.style.textDecoration = 'line-through';
        }
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = async () => {
          await fetch(`/tasks/${task._id}`, { method: 'DELETE' });
          fetchTasks();
        };
        li.appendChild(deleteButton);
        taskList.appendChild(li);
        li.onclick = async () => {
          await fetch(`/tasks/${task._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
          });
          fetchTasks();
        };
      });
    };
  
    taskForm.onsubmit = async (e) => {
      e.preventDefault();
      const title = taskInput.value;
      await fetch('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
      });
      taskInput.value = '';
      fetchTasks();
    };
  
    fetchTasks();
  });
  