import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// Configure axios default baseURL
// This should be changed to match your API endpoint
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Add axios interceptor for authentication
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

const app = createApp(App)

// Use router
app.use(router)

// Mount app
app.mount('#app')
