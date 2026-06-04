<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useTodoStore } from "./stores/todo.store";

// Connect to our Pinia store
const store = useTodoStore();

// State for the new to-do input field
const newTodoTitle = ref("");
let stopRealtime: null | (() => void) = null; // This will hold the function to stop real-time updates

//  LOCAL FILTER STATE
type FilterType = "all" | "active" | "done";
const filter = ref<FilterType>("all");

//  COMPUTED TO DETERMINE WHICH LIST TO SHOW
const displayedTodos = computed(() => {
  if (filter.value === "active") return store.activeTodos;
  if (filter.value === "done") return store.doneTodos;
  return store.todos;
});

// Fetch the to-dos from Hasura as soon as the app loads
onMounted(() => {
  store.fetchTodos();
  stopRealtime = store.startRealtime();
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

    <div class="add-todo">
      <input
        v-model="newTodoTitle"
        @keyup.enter="handleAdd"
        type="text"
        placeholder="What needs to be done?"
      />
      <button @click="handleAdd" :disabled="store.loading">Add Task</button>
    </div>

    <div class="tabs">
      <button :class="{ active: filter === 'all' }" @click="filter = 'all'">
        All ({{ store.todos.length }})
      </button>
      <button
        :class="{ active: filter === 'active' }"
        @click="filter = 'active'"
      >
        Active ({{ store.activeTodos.length }})
      </button>
      <button :class="{ active: filter === 'done' }" @click="filter = 'done'">
        Done ({{ store.doneTodos.length }})
      </button>
    </div>

    <p v-if="store.loading && store.todos.length === 0" class="status">
      Loading tasks...
    </p>
    <p v-else-if="store.error" class="error">{{ store.error }}</p>

    <ul class="todo-list" v-else>
      <li v-for="todo in displayedTodos" :key="todo.id" class="todo-item">
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

      <li v-if="displayedTodos.length === 0" class="empty-state">
        No tasks in this view!
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

/* TAB STYLES */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
}

.tabs button {
  padding: 8px 16px;
  border: 1px solid #ccc;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.2s ease-in-out;
}

.tabs button:hover {
  background: #f3f4f6;
}

.tabs button.active {
  background: #42b883;
  color: white;
  border-color: #42b883;
  font-weight: bold;
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
