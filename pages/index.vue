<template>
  <div class="container">
    <h1>Taskify App: Derrick</h1>

    <!-- Alert message -->
    <div v-if="alert.message" :class="['alert', alert.type]">
      {{ alert.message }}
    </div>

    <form @submit.prevent="addTask" class="task-form">
      <input v-model="newtaskTitle" placeholder="New task title" required />
      <input v-model="newtaskDescription" placeholder="Description" />
      <input type="date" v-model="newtaskDueDate" />
      <button type="submit">Add Task</button>
    </form>

    <div v-if="loading" class="loading">Loading tasks...</div>
    <template v-else>
      <div v-if="tasks.length === 0" class="empty-state">
        <span>No tasks yet. Add your first task!</span>
      </div>
      <div v-else class="task-cards">
        <div
          v-for="task in tasks"
          :key="task.id"
          :class="['task-card', statusClass(task.status)]"
        >
          <div class="task-card-content">
            <div class="task-card-header">
              <select
                v-model="task.status"
                @change="updateTaskStatus(task)"
                class="status-select"
              >
                <option value="Not started">Not started</option>
                <option value="In progress">In progress</option>
                <option value="Completed">Completed</option>
              </select>
              <span
                class="task-title"
                @dblclick="editTask(task)"
                v-if="!task.editing"
                >{{ task.title }}</span
              >
              <input
                v-if="task.editing"
                v-model="task.editedTitle"
                @keyup.enter="saveEdit(task)"
                @blur="cancelEdit(task)"
              />
            </div>
            <div class="task-description">
              {{ task.description || "No description." }}
            </div>
            <div class="date">
              <span v-if="task.dueDate" class="task-due-date"
                >Due: {{ formatDate(task.dueDate) }}</span
              >
              <span class="task-created-at"
                >Created: {{ formatDate(task.createdAt) }}</span
              >
            </div>
          </div>
          <button @click="deleteTask(task.id)" class="delete-button">
            Delete
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const tasks = ref([]);
const newtaskTitle = ref("");
const newtaskDescription = ref("");
const newtaskDueDate = ref("");
const loading = ref(false);

// Alert state
const alert = ref({ message: "", type: "" });
const showAlert = (message, type = "success") => {
  alert.value = { message, type };
  setTimeout(() => {
    alert.value = { message: "", type: "" };
  }, 2500);
};

const statusClass = (status) => {
  if (status === "Completed") return "status-completed";
  if (status === "In progress") return "status-inprogress";
  return "status-notstarted";
};

const fetchTasks = async () => {
  loading.value = true;
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tasks.value = await response.json();
    // Ensure status is always set
    tasks.value.forEach((task) => {
      if (!task.status) task.status = "Not started";
    });
    showAlert("Tasks loaded!", "success");
  } catch (error) {
    console.error("Failed to fetch tasks:", error);
    showAlert("Failed to load tasks.", "error");
  } finally {
    loading.value = false;
  }
};

const addTask = async () => {
  if (newtaskTitle.value.trim() === "") return;
  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newtaskTitle.value,
        description: newtaskDescription.value,
        dueDate: new Date(newtaskDueDate.value).getTime() || null,
        status: "Not started",
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const addedtask = await response.json();
    if (!addedtask.status) addedtask.status = "Not started";
    tasks.value.push(addedtask);
    newtaskTitle.value = "";
    newtaskDescription.value = "";
    newtaskDueDate.value = "";
    showAlert("Task added!", "success");
  } catch (error) {
    console.error("Failed to add task:", error);
    showAlert("Failed to add task.", "error");
  }
};

const updateTaskStatus = async (task) => {
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: task.status,
        createdAt: task.createdAt,
        dueDate: task.dueDate,
        title: task.title,
        description: task.description,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    showAlert("Task status updated!", "success");
  } catch (error) {
    console.error("Failed to update task status:", error);
    showAlert("Failed to update status.", "error");
  }
};

const deleteTask = async (id) => {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    tasks.value = tasks.value.filter((task) => task.id !== id);
    showAlert("Task deleted!", "success");
  } catch (error) {
    console.error("Failed to delete task:", error);
    showAlert("Failed to delete task.", "error");
  }
};

const editTask = (task) => {
  task.editing = true;
  task.editedTitle = task.title;
};

const saveEdit = async (task) => {
  if (task.editedTitle.trim() === "") {
    cancelEdit(task);
    return;
  }
  try {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: task.editedTitle,
        createdAt: task.createdAt,
        status: task.status,
        dueDate: task.dueDate,
        description: task.description,
      }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    task.title = task.editedTitle;
    task.editing = false;
    showAlert("Task updated!", "success");
  } catch (error) {
    console.error("Failed to save edit:", error);
    task.editing = false;
    showAlert("Failed to update task.", "error");
  }
};

const cancelEdit = (task) => {
  task.editing = false;
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(parseInt(dateString));
  return date.toLocaleDateString();
};

onMounted(() => {
  fetchTasks();
});
</script>

<style scoped>
.container {
  max-width: 700px;
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

.task-form input[placeholder="Description"] {
  min-width: 180px;
  flex-grow: 2;
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

.task-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
  justify-content: center;
}

.task-card {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 18px 20px 14px 20px;
  min-width: 270px;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: box-shadow 0.2s;
}

.task-card.status {
  text-decoration: line-through;
  color: #888;
  background-color: #e9e9e9;
}

.task-card-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.task-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.task-title {
  font-weight: bold;
  flex-grow: 1;
}

.task-description {
  font-size: 0.98em;
  color: #555;
  margin-bottom: 4px;
  margin-left: 28px;
}

.date {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-left: 28px;
}

.task-due-date,
.task-created-at {
  font-size: 0.8em;
  color: #666;
}

.task-card input[type="checkbox"] {
  margin-right: 10px;
}

.task-card input[type="text"] {
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
  align-self: flex-end;
  margin-top: 10px;
}

.delete-button:hover {
  background-color: #c82333;
}

.loading {
  text-align: center;
  color: #888;
  margin: 2rem 0;
  font-size: 1.2em;
}

.alert {
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
  transition: opacity 0.3s;
}
.alert.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #b6e2c6;
}
.alert.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
.empty-state {
  text-align: center;
  color: #aaa;
  margin: 2rem 0;
  font-size: 1.1em;
}

.status-select {
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 0.98em;
  margin-right: 10px;
  background: #f7f7f7;
}

.status-notstarted {
  border-left: 6px solid #bdbdbd;
}

.status-inprogress {
  border-left: 6px solid #ffc107;
  background: #fffbe6;
}

.status-completed {
  border-left: 6px solid #28a745;
  background: #eafbe7;
  color: #1c5c2e;
  text-decoration: line-through;
}
</style>
