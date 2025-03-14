<template>
  <div class="permissions-container">
    <h1>Permissions Management</h1>
    
    <!-- Create Permission Form -->
    <div class="form-section">
      <h2>Create New Permission</h2>
      <form @submit.prevent="createPermission" class="create-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input 
            type="text" 
            id="name" 
            v-model="newPermission.name" 
            required 
            placeholder="e.g., project:create"
          />
        </div>
        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description" 
            v-model="newPermission.description" 
            placeholder="Explain what this permission allows"
          ></textarea>
        </div>
        <button type="submit" class="btn-primary" :disabled="isCreating">
          {{ isCreating ? 'Creating...' : 'Create Permission' }}
        </button>
      </form>
    </div>
    
    <!-- Search and Filter -->
    <div class="filter-section">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search permissions..." 
        class="search-input"
        @input="fetchPermissions"
      />
    </div>
    
    <!-- Permissions List -->
    <div class="permissions-list">
      <div v-if="loading" class="loading">Loading permissions...</div>
      <div v-else-if="permissions.length === 0" class="no-data">
        No permissions found. Create a new one above.
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="permission in permissions" :key="permission.id">
            <td>{{ permission.id }}</td>
            <td>{{ permission.name }}</td>
            <td>{{ permission.description }}</td>
            <td>{{ formatDate(permission.created_at) }}</td>
            <td class="actions">
              <button @click="editPermission(permission)" class="btn-edit">Edit</button>
              <button @click="confirmDelete(permission.id)" class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- Pagination -->
      <div class="pagination" v-if="permissions.length > 0">
        <button 
          @click="prevPage" 
          :disabled="pagination.page === 1"
          class="btn-page"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ pagination.page }} of {{ pagination.pages }}
        </span>
        <button 
          @click="nextPage" 
          :disabled="pagination.page === pagination.pages"
          class="btn-page"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Edit Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showEditModal = false">&times;</span>
        <h2>Edit Permission</h2>
        <form @submit.prevent="updatePermission">
          <div class="form-group">
            <label for="edit-name">Name</label>
            <input 
              type="text" 
              id="edit-name" 
              v-model="editedPermission.name" 
              required
            />
          </div>
          <div class="form-group">
            <label for="edit-description">Description</label>
            <textarea 
              id="edit-description" 
              v-model="editedPermission.description"
            ></textarea>
          </div>
          <button type="submit" class="btn-primary" :disabled="isUpdating">
            {{ isUpdating ? 'Updating...' : 'Update Permission' }}
          </button>
        </form>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal">
      <div class="modal-content">
        <span class="close" @click="showDeleteModal = false">&times;</span>
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this permission? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="btn-cancel">Cancel</button>
          <button @click="deletePermission" class="btn-confirm-delete" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PermissionsView',
  data() {
    return {
      // Permissions list data
      permissions: [],
      loading: true,
      error: null,
      
      // Pagination
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
      },
      
      // Search and filters
      searchQuery: '',
      
      // New permission form
      newPermission: {
        name: '',
        description: ''
      },
      isCreating: false,
      
      // Edit permission
      showEditModal: false,
      editedPermission: {
        id: null,
        name: '',
        description: ''
      },
      isUpdating: false,
      
      // Delete permission
      showDeleteModal: false,
      permissionIdToDelete: null,
      isDeleting: false
    }
  },
  created() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      this.loading = true;
      try {
        const response = await axios.get('/api/v1/system/permissions', {
          params: {
            page: this.pagination.page,
            limit: this.pagination.limit,
            search: this.searchQuery
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        this.permissions = response.data.data;
        this.pagination = response.data.pagination || {
          page: 1,
          limit: 10,
          total: this.permissions.length,
          pages: 1
        };
      } catch (error) {
        console.error('Error fetching permissions:', error);
        this.error = 'Failed to load permissions. Please try again.';
      } finally {
        this.loading = false;
      }
    },
    
    async createPermission() {
      this.isCreating = true;
      try {
        await axios.post('/api/v1/system/permissions', this.newPermission, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Reset form and refresh list
        this.newPermission = { name: '', description: '' };
        this.fetchPermissions();
      } catch (error) {
        console.error('Error creating permission:', error);
        alert('Failed to create permission: ' + (error.response?.data?.message || 'Unknown error'));
      } finally {
        this.isCreating = false;
      }
    },
    
    editPermission(permission) {
      this.editedPermission = { ...permission };
      this.showEditModal = true;
    },
    
    async updatePermission() {
      this.isUpdating = true;
      try {
        await axios.put(`/api/v1/system/permissions/${this.editedPermission.id}`, {
          name: this.editedPermission.name,
          description: this.editedPermission.description
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Close modal and refresh list
        this.showEditModal = false;
        this.fetchPermissions();
      } catch (error) {
        console.error('Error updating permission:', error);
        alert('Failed to update permission: ' + (error.response?.data?.message || 'Unknown error'));
      } finally {
        this.isUpdating = false;
      }
    },
    
    confirmDelete(id) {
      this.permissionIdToDelete = id;
      this.showDeleteModal = true;
    },
    
    async deletePermission() {
      this.isDeleting = true;
      try {
        await axios.delete(`/api/v1/system/permissions/${this.permissionIdToDelete}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        // Close modal and refresh list
        this.showDeleteModal = false;
        this.fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
        alert('Failed to delete permission: ' + (error.response?.data?.message || 'Unknown error'));
      } finally {
        this.isDeleting = false;
      }
    },
    
    prevPage() {
      if (this.pagination.page > 1) {
        this.pagination.page--;
        this.fetchPermissions();
      }
    },
    
    nextPage() {
      if (this.pagination.page < this.pagination.pages) {
        this.pagination.page++;
        this.fetchPermissions();
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.permissions-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

h2 {
  color: #444;
  margin-bottom: 1rem;
}

/* Form Section */
.form-section {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.create-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

input, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

/* Buttons */
.btn-primary {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  grid-column: span 2;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-primary:disabled {
  background-color: #9e9e9e;
  cursor: not-allowed;
}

/* Filter Section */
.filter-section {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

.data-table th, .data-table td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

.data-table th {
  background-color: #f2f2f2;
  font-weight: 600;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1.5rem;
}

.btn-page {
  background-color: #f2f2f2;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  margin: 0 1rem;
}

/* Modals */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background-color: #f2f2f2;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-confirm-delete {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

/* Loading and No Data states */
.loading, .no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Form in Edit Modal */
.modal .form-group {
  margin-bottom: 1rem;
}

.modal input, .modal textarea {
  width: 100%;
}
</style> 