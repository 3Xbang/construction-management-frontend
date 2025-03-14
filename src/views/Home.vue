<template>
  <div class="home">
    <h1>Construction Management System</h1>
    <div class="dashboard">
      <div class="dashboard-card" v-for="(card, index) in dashboardCards" :key="index">
        <h2>{{ card.title }}</h2>
        <p>{{ card.description }}</p>
        <router-link :to="card.link" class="btn">View</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomeView',
  data() {
    return {
      dashboardCards: [
        {
          title: 'Permissions',
          description: 'Manage user roles and permissions',
          link: '/permissions'
        },
        {
          title: 'Projects',
          description: 'Manage construction projects',
          link: '/projects'
        },
        {
          title: 'Documents',
          description: 'Handle project documentation',
          link: '/documents'
        },
        {
          title: 'Resources',
          description: 'Allocate and track resources',
          link: '/resources'
        }
      ]
    }
  }
}
</script>

<style scoped>
.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.dashboard-card {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dashboard-card h2 {
  color: #333;
  margin-bottom: 0.5rem;
}

.dashboard-card p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}
</style> 