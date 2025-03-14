<script>
export default {
  data() {
    return {
      isLoggedIn: false,
      username: ''
    }
  },
  created() {
    // Check if user is logged in on component creation
    this.checkAuth();
  },
  methods: {
    checkAuth() {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      this.isLoggedIn = !!token;
      this.username = user.username || '';
    },
    logout() {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update component state
      this.isLoggedIn = false;
      this.username = '';
      
      // Redirect to login page
      this.$router.push('/login');
    }
  },
  watch: {
    // Watch for route changes to check authentication
    '$route'() {
      this.checkAuth();
    }
  }
}
</script>

<template>
  <div class="app">
    <nav v-if="isLoggedIn" class="main-nav">
      <div class="nav-container">
        <div class="logo-section">
          <img alt="Company logo" class="logo" src="./assets/logo.svg" width="40" height="40" />
          <h1>Construction Management</h1>
        </div>
        
        <div class="nav-links">
          <router-link to="/" class="nav-link">Home</router-link>
          <router-link to="/permissions" class="nav-link">Permissions</router-link>
          <router-link to="/projects" class="nav-link">Projects</router-link>
          <router-link to="/documents" class="nav-link">Documents</router-link>
          <router-link to="/resources" class="nav-link">Resources</router-link>
        </div>
        
        <div class="user-section">
          <span class="username">{{ username }}</span>
          <button @click="logout" class="logout-button">Logout</button>
        </div>
      </div>
    </nav>

    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Global styles */
:root {
  --primary-color: #4CAF50;
  --primary-hover: #45a049;
  --secondary-color: #2196F3;
  --text-color: #333;
  --light-gray: #f5f5f5;
  --border-color: #ddd;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: #f9f9f9;
}

/* App Layout */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 60px; /* Height of the navbar */
}

/* Navigation */
.main-nav {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: fixed;
  top::0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-section h1 {
  margin-left: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--primary-color);
  transition: width 0.3s ease;
}

.nav-link:hover:after,
.router-link-active:after {
  width: 100%;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
}

.logout-button {
  background-color: var(--light-gray);
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-button:hover {
  background-color: #e0e0e0;
}

/* Router transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
