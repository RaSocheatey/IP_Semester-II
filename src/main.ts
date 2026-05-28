import { createApp, h, provide } from 'vue'
import { createPinia } from 'pinia'
import { DefaultApolloClient } from '@vue/apollo-composable'
import App from './App.vue'
import { apolloClient } from './apollo/client'

const app = createApp({
  setup() {
    // This makes Apollo available globally to all your Vue components
    provide(DefaultApolloClient, apolloClient)
  },
  render: () => h(App),
})

// This activates Pinia for state management
app.use(createPinia())
app.mount('#app')