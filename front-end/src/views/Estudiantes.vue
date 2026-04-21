<script setup>
import { ref, onMounted, computed } from 'vue';
import api from '../api/estudiantes';

const estudiantes = ref([]);
const loading = ref(true);
const error = ref(null);
const showModal = ref(false);
const editingStudent = ref(null);
const searchQuery = ref('');

const form = ref({
  codigo_estudiante: '',
  nombres: '',
  apellidos: '',
  correo: '',
  telefono: '',
  programa: '',
  estado: 'active'
});

const estados = ['active', 'inactive', 'graduated', 'suspended'];

const filteredEstudiantes = computed(() => {
  if (!searchQuery.value) return estudiantes.value;
  const query = searchQuery.value.toLowerCase();
  return estudiantes.value.filter(e => 
    e.nombres.toLowerCase().includes(query) ||
    e.apellidos.toLowerCase().includes(query) ||
    e.codigo_estudiante.toLowerCase().includes(query)
  );
});

onMounted(() => {
  fetchEstudiantes();
});

async function fetchEstudiantes() {
  loading.value = true;
  error.value = null;
  try {
    const response = await api.getAll();
    estudiantes.value = response.data.data || response.data;
  } catch (err) {
    error.value = 'Error al cargar estudiantes';
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  editingStudent.value = null;
  form.value = {
    codigo_estudiante: '',
    nombres: '',
    apellidos: '',
    correo: '',
    telefono: '',
    programa: '',
    estado: 'active'
  };
  showModal.value = true;
}

function openEditModal(estudiante) {
  editingStudent.value = estudiante;
  form.value = { ...estudiante };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingStudent.value = null;
}

async function saveEstudiante() {
  try {
    if (editingStudent.value) {
      await api.update(editingStudent.value.id, form.value);
    } else {
      await api.create(form.value);
    }
    closeModal();
    fetchEstudiantes();
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al guardar';
  }
}

async function deleteEstudiante(id) {
  if (!confirm('¿Estás seguro de eliminar este estudiante?')) return;
  try {
    await api.delete(id);
    fetchEstudiantes();
  } catch (err) {
    error.value = 'Error al eliminar';
  }
}
</script>

<template>
  <div class="estudiantes">
    <div class="header">
      <h1>Estudiantes</h1>
      <button @click="openCreateModal" class="btn-primary">+ Nuevo Estudiante</button>
    </div>

    <div class="search-bar">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Buscar estudiantes..." 
        class="search-input"
      />
    </div>

    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombres</th>
          <th>Apellidos</th>
          <th>Correo</th>
          <th>Programa</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="est in filteredEstudiantes" :key="est.id">
          <td>{{ est.codigo_estudiante }}</td>
          <td>{{ est.nombres }}</td>
          <td>{{ est.apellidos }}</td>
          <td>{{ est.correo }}</td>
          <td>{{ est.programa }}</td>
          <td>
            <span :class="['badge', est.estado]">{{ est.estado }}</span>
          </td>
          <td>
            <button @click="openEditModal(est)" class="btn-small">Editar</button>
            <button @click="deleteEstudiante(est.id)" class="btn-small btn-danger">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h2>{{ editingStudent ? 'Editar' : 'Nuevo' }} Estudiante</h2>
        <form @submit.prevent="saveEstudiante">
          <div class="form-group">
            <label>Código</label>
            <input v-model="form.codigo_estudiante" required />
          </div>
          <div class="form-group">
            <label>Nombres</label>
            <input v-model="form.nombres" required />
          </div>
          <div class="form-group">
            <label>Apellidos</label>
            <input v-model="form.apellidos" required />
          </div>
          <div class="form-group">
            <label>Correo</label>
            <input v-model="form.correo" type="email" required />
          </div>
          <div class="form-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" />
          </div>
          <div class="form-group">
            <label>Programa</label>
            <input v-model="form.programa" required />
          </div>
          <div class="form-group">
            <label>Estado</label>
            <select v-model="form.estado">
              <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
            </select>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn-secondary">Cancelar</button>
            <button type="submit" class="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.estudiantes {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 { margin: 0; color: #2c3e50; }

.search-bar { margin-bottom: 1rem; }

.search-input {
  padding: 0.75rem;
  width: 100%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.loading, .error {
  padding: 2rem;
  text-align: center;
}

.error { color: #e74c3c; }

.table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

.table th, .table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.badge.active { background: #e8f8f0; color: #27ae60; }
.badge.inactive { background: #fef9e7; color: #f39c12; }
.badge.graduated { background: #e8f4f8; color: #3498db; }
.badge.suspended { background: #fde8e8; color: #e74c3c; }

.btn-primary, .btn-secondary, .btn-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary { background: #3498db; color: #fff; }
.btn-secondary { background: #95a5a6; color: #fff; }
.btn-small { background: #3498db; color: #fff; padding: 0.4rem 0.8rem; font-size: 0.85rem; }
.btn-danger { background: #e74c3c; }
.btn-small, .btn-primary, .btn-secondary { margin-right: 0.5rem; }

.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
}

.modal h2 { margin-top: 0; }

.form-group { margin-bottom: 1rem; }

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>