<template>
  <div class="container">
    <h1>Nuxt tasks App</h1>

    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newtaskTitle" placeholder="New task title" required />
      <input type="date" v-model="newtaskDueDate" />
      <button type="submit">Add Task</button>
    </form>

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id" :class="{ completed: task.isCompleted }">
        <div class="task-content">
          <input
            type="checkbox"
            v-model="task.isCompleted"
            @change="updateTaskStatus(task)"
          />
          <span class="task-title" @dblclick="editTask(task)">{{ task.title }}</span>
          <input
            v-if="task.editing"
            v-model="task.editedTitle"
            @keyup.enter="saveEdit(task)"
            @blur="cancelEdit(task)"
          />
          <div class="date">
            <span v-if="task.dueDate" class="task-due-date">Due: {{ formatDate(task.dueDate) }}</span>
            <span class="task-created-at">Created: {{ formatDate(task.createdAt) }}</span>
          </div>
        </div>
        <button @click="deleteTask(task.id)" class="delete-button">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tasks = ref([]);
const newtaskTitle = ref('');
const newtaskDueDate = ref('');

const fetchTasks = async () => {
  try {
    const response = await fetch('/api/tasks');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tasks.value = await response.json();
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
  }
};

const addTask = async () => {
  if (newtaskTitle.value.trim() === '') return;
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: newtaskTitle.value,
        dueDate: new Date(newtaskDueDate.value).getTime() || null,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const addedtask = await response.json();
    tasks.value.push(addedtask);
    newtaskTitle.value = '';
    newtaskDueDate.value = '';
  } catch (error) {
    console.error("Failed to add task:", error);
  }
};

const updateTaskStatus = async (task) => {
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        isCompleted: task.isCompleted,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error("Failed to update task status:", error);
    // Revert the change if the API call fails
    task.isCompleted = !task.isCompleted;
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tasks.value = tasks.value.filter(task => task.id !== id);
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};

const editTask = (task) => {
  task.editing = true;
  task.editedTitle = task.title;
};

const saveEdit = async (task) => {
  if (task.editedTitle.trim() === '') {
    cancelEdit(task);
    return;
  }
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.editedTitle,
        createdAt: task.createdAt,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    task.title = task.editedTitle;
    task.editing = false;
  } catch (error) {
    console.error("Failed to save edit:", error);
    task.editing = false; // Exit editing mode even on error
  }
};

const cancelEdit = (task) => {
  task.editing = false;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(parseInt(dateString));
  return date.toLocaleDateString();
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.task-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.task-form input[type="text"],
.task-form input[type="date"] {
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.task-form button {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.task-form button:hover {
  background-color: #0056b3;
}

.task-list {
  list-style: none;
  padding: 0;
}

.task-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  background-color: #f9f9f9;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.task-list li.completed {
  text-decoration: line-through;
  color: #888;
  background-color: #e9e9e9;
}

.task-content {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-grow: 1;
}

.task-title {
  font-weight: bold;
  flex-grow: 1;
}

.date {
  display: grid;
  margin-right: 1rem;
}

.task-due-date,
.task-created-at {
  font-size: 0.8em;
  color: #666;
}

.task-list li input[type="checkbox"] {
  margin-right: 10px;
}

.task-list li input[type="text"] {
  flex-grow: 1;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 3px;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>