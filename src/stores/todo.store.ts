import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '../apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '../graphql/todos'

export type Todo = {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const activeTodos = computed(() => todos.value.filter(t => !t.is_done))
  const doneTodos = computed(() => todos.value.filter(t => t.is_done))

  // 1. Read: Fetch all todos
  async function fetchTodos() {
    loading.value = true
    error.value = null
    try {
      const { data } = await apolloClient.query<{ todos: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only', 
      })
      todos.value = data.todos
    } catch (e: any) {
      error.value = e.message ?? 'Failed to load todos'
    } finally {
      loading.value = false
    }
  }

  // 2. Create: Add a new todo
  async function addTodo(title: string) {
    const clean = title.trim()
    if (!clean) return

    await apolloClient.mutate({
      mutation: ADD_TODO,
      variables: { title: clean },
    })
    await fetchTodos() 
  }

  // 3. Update: Check or uncheck a todo
  async function toggleTodo(todo: Todo) {
    await apolloClient.mutate({
      mutation: TOGGLE_TODO,
      variables: { id: todo.id, done: !todo.is_done },
    })
    await fetchTodos() 
  }

  // 4. Delete: Remove a todo
  async function deleteTodo(id: string) {
    await apolloClient.mutate({
      mutation: DELETE_TODO,
      variables: { id },
    })
    await fetchTodos() 
  }

  // 5. Subscription: Listen for live updates
  function startRealtime() {
    const obs = apolloClient.subscribe<{ todos: Todo[] }>({
      query: TODOS_SUB,
    })

    const sub = obs.subscribe({
      next: ({ data }) => {
        if (data?.todos) todos.value = data.todos
      },
      error: (e) => {
        console.error('Subscription error', e)
      },
    })

    return () => sub.unsubscribe()
  }

  return {
    todos,
    activeTodos,
    doneTodos,
    loading,
    error,
    fetchTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    startRealtime,
  }
})