import { defineStore } from "pinia";
import axios from "axios"; 

const API_URL = "http://localhost:3100/tasks"; // Your NestJS address

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    // countTodos: (state) => state.todos.length,
    // FIX: Only count tasks where completedAt is null
    countTodos: (state) => {
      return state.todos.filter(task => task.completedAt === null).length;
    },
  },
  actions: {
    // 2. FETCH: Get real data from SQLite
    async fetchTodos() {
      try {
        const response = await axios.get("http://localhost:3100/tasks");
        this.todos = response.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    },

    // 3. TOGGLE: Update status in the database
    async toggleStatus(id) {
      const task = this.todos.find((t) => t.id === id);
      if (!task) return;

      try {
        // If it's already done, we'd normally call a 'pending' route 
        // but based on your NestJS logic, let's use the 'done' route:
        const url = task.completedAt 
          ? `${API_URL}/${id}/pending` // Optional: if you made a pending route
          : `${API_URL}/${id}/done`;

        const response = await axios.patch(url);
        
        // Update local state with the database response
        const index = this.todos.findIndex((t) => t.id === id);
        this.todos[index] = response.data;
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },

    // 4. ADD: Save new task to the database
    async addTodo(todoName) {
      try {
        const response = await axios.post("http://localhost:3100/tasks", {
          name: todoName,
          description: "Task from Vue Client",
          user: 1 // Linking to your User ID 1 (Socheatey)
        });
        
        this.todos.push(response.data);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    },

    // 5. CLEAR: Delete from database (Optional: depends on your API)
    // clearAll() {
    //   // In a real app, you would loop through and delete or call a bulk delete
    //   this.todos = []; 
    // },
    // 5. CLEAR: Delete finished tasks from the database
    async clearAll() {
      try {
        // Find tasks where completedAt is NOT null
        const completedTasks = this.todos.filter(t => t.completedAt !== null);
        
        // Use a loop to send a DELETE request for each completed task
        for (const task of completedTasks) {
          await axios.delete(`${API_URL}/${task.id}`);
        }
        
        // Refresh the list from NestJS to show the updated database state
        await this.fetchTodos();
        console.log("Cleanup complete: Completed tasks removed from SQLite.");
      } catch (error) {
        console.error("Error during database cleanup:", error);
      }
    },
  },
});