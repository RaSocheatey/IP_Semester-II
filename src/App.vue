<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useTodoStore } from "./stores/todo.store";

// Connect to our Pinia store
const store = useTodoStore();

// State for the new to-do input field
const newTodoTitle = ref("");

// Fetch the to-dos from Hasura as soon as the app loads
onMounted(() => {
  store.fetchTodos();

  // Optional: Uncomment the next line to enable live real-time updates!
  // store.startRealtime()
});

// Function to handle adding a task
const handleAdd = async () => {
  if (!newTodoTitle.value) return;
  await store.addTodo(newTodoTitle.value);
  newTodoTitle.value = ""; // Clear the input box after adding
};
</script>

<template>
  <main class="container">
    <h1>📝 My Vue + Hasura To-Do's</h1>

    <!-- Input section to add new tasks -->
    <div class="add-todo">
      <input
        v-model="newTodoTitle"
        @keyup.enter="handleAdd"
        type="text"
        placeholder="What needs to be done?"
      />
      <button @click="handleAdd" :disabled="store.loading">Add Task</button>
    </div>

    <!-- Loading and Error messages -->
    <p v-if="store.loading && store.todos.length === 0" class="status">
      Loading tasks...
    </p>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <!-- The actual list of tasks -->
    <ul class="todo-list" v-else>
      <li v-for="todo in store.todos" :key="todo.id" class="todo-item">
        <label class="todo-label">
          <input
            type="checkbox"
            :checked="todo.is_done"
            @change="store.toggleTodo(todo)"
          />
          <span :class="{ done: todo.is_done }">{{ todo.title }}</span>
        </label>
        <button @click="store.deleteTodo(todo.id)" class="delete-btn">
          ❌
        </button>
      </li>

      <!-- Show this if the list is completely empty -->
      <li v-if="store.todos.length === 0" class="empty-state">
        No tasks yet! Add one above.
      </li>
    </ul>
  </main>
</template>

<style>
/* Basic styling to make it look clean and centered */
body {
  background-color: #f3f4f6;
  margin: 0;
  font-family: Arial, sans-serif;
}

.container {
  max-width: 500px;
  margin: 50px auto;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
  font-size: 24px;
  margin-bottom: 20px;
}

.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.add-todo input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.add-todo button {
  padding: 12px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.add-todo button:hover {
  background: #33a06f;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 10px;
  border-bottom: 1px solid #eee;
}

.todo-item:last-child {
  border-bottom: none;
}

.todo-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 18px;
}

.todo-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.done {
  text-decoration: line-through;
  color: #999;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.6;
}

.delete-btn:hover {
  opacity: 1;
}

.status,
.empty-state {
  text-align: center;
  color: #666;
  margin-top: 20px;
}

.error {
  color: red;
  text-align: center;
}
</style>
