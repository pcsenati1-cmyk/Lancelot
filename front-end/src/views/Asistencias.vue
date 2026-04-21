<script setup>
import { ref, onMounted, computed } from 'vue';
import apiEstudiantes from '../api/estudiantes';
import apiAsistencias from '../api/asistencias';

const estudiantes = ref([]);
const asistencias = ref([]);
const loading = ref(true);
const error = ref(null);
const selectedDate = ref(new Date().toISOString().split('T')[0]);
const showBulkModal = ref(false);

const registros = ref([]);

const stats = computed(() => {
  const total = asisten.value.length;
  const presente = asisten.value.filter(a => a.estado === 'presente').length;
  const ausente = asisten.value.filter(a => a.estado === 'ausente').length;
  const tarde = estudiantes.value.filter(a => a.estado === 'tarde').length;
  return { total, presente, ausente, tarde };
});

const asisten = ref([]);

onMounted(() => {
  fetchData();
});

async function fetchData() {
  loading.value = true;
  try {
    const [estRes, asisRes] = await Promise.all([
      apiEstudiantes.getAll(),
      apiAsistencias.getByDate(selectedDate.value)
    ]);
    estudiantes.value = estRes.data.data || estRes.data;
    asisten.value = asisRes.data.data || asisRes.data;
  } catch (err) {
    error.value = 'Error al cargar datos';
  } finally {
    loading.value = false;
  }
}

function getAsistencia(estudianteId) {
  return asisten.value.find(a => a.estudiante_id === estudianteId);
}

function openBulkModal() {
  registros.value = estudiantes.value.map(e => ({
    estudiante_id: e.id,
    estado: 'presente',
    observacion: ''
  }));
  showBulkModal.value = true;
}

function closeBulkModal() {
  showBulkModal.value = false;
}

async function saveBulk() {
  try {
    await apiAsistencias.createBulk({
      fecha_asistencia: selectedDate.value,
      registros: registros.value
    });
    closeBulkModal();
    fetchData();
  } catch (err) {
    error.value = 'Error al guardar';
  }
}

async function toggleAsistencia(estudianteId, estado) {
  const existing = getAsistencia(estudianteId);
  try {
    if (existing) {
      await apiAsistencias.update(existing.id, {
        estudiante_id: estudianteId,
        fecha_asistencia: selectedDate.value,
        estado
      });
    } else {
      await apiAsistencias.create({
        estudiante_id: estudianteId,
        fecha_asistencia: selectedDate.value,
        estado
      });
    }
    fetchData();
  } catch (err) {
    error.value = 'Error al guardar';
  }
}

function updateDate() {
  fetchData();
}
</script>

<template>
  <div class="asistencias">
    <div class="header">
      <h1>Registro de Asistencias</h1>
      <button @click="openBulkModal" class="btn-primary">Bulk</button>
    </div>

    <div class="date-selector">
      <label>Fecha:</label>
      <input 
        v-model="selectedDate" 
        type="date" 
        @change="updateDate"
        class="date-input"
      />
    </div>

    <div class="summary">
      <div class="stat">
        <span class="label">Total:</span>
        <span class="value">{{ asisten.length }}</span>
      </div>
      <div class="stat presente">
        <span class="label">Presentes:</span>
        <span class="value">{{ asisten.filter(a => a.estado === 'presente').length }}</span>
      </div>
      <div class="stat ausente">
        <span class="label">Ausentes:</span>
        <span class="value">{{ asisten.filter(a => a.estado === 'ausente').length }}</span>
      </div>
      <div class="stat tarde">
        <span class="label">Tarde:</span>
        <span class="value">{{ asisten.filter(a => a.estado === 'tarde').length }}</span>
      </div>
    </div>

    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <table v-else class="table">
      <thead>
        <tr>
          <th>Código</th>
          <th>Nombre</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="est in estudiantes" :key="est.id">
          <td>{{ est.codigo_estudiante }}</td>
          <td>{{ est.nombres }} {{ est.apellidos }}</td>
          <td>
            <span v-if="getAsistencia(est.id)" :class="['badge', getAsistencia(est.id).estado]">
              {{ getAsistencia(est.id).estado }}
            </span>
            <span v-else class="badge pending">Sin registro</span>
          </td>
          <td>
            <button 
              @click="toggleAsistencia(est.id, 'presente')" 
              class="btn-small presente"
              :class="{ active: getAsistencia(est.id)?.estado === 'presente' }"
            >P</button>
            <button 
              @click="toggleAsistencia(est.id, 'ausente')" 
              class="btn-small ausente"
              :class="{ active: getAsistencia(est.id)?.estado === 'ausente' }"
            >A</button>
            <button 
              @click="toggleAsistencia(est.id, 'tarde')" 
              class="btn-small tarde"
              :class="{ active: getAsistencia(est.id)?.estado === 'tarde' }"
            >T</button>
            <button 
              @click="toggleAsistencia(est.id, 'eximido')" 
              class="btn-small eximido"
              :class="{ active: getAsistencia(est.id)?.estado === 'eximido' }"
            >E</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showBulkModal" class="modal-overlay" @click.self="closeBulkModal">
      <div class="modal">
        <h2>Registro Bulk - {{ selectedDate }}</h2>
        <div class="bulk-list">
          <div v-for="(reg, index) in registros" :key="index" class="bulk-item">
            <span>{{ estudiantes.find(e => e.id === reg.estudiante_id)?.nombres }}</span>
            <select v-model="reg.estado">
              <option value="presente">Presente</option>
              <option value="ausente">Ausente</option>
              <option value="tarde">Tarde</option>
              <option value="eximido">Eximido</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="closeBulkModal" class="btn-secondary">Cancelar</button>
          <button @click="saveBulk" class="btn-primary">Guardar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.asistencias {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 { margin: 0; color: #2c3e50; }

.date-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  min-width: 100px;
}

.stat .label { display: block; font-size: 0.85rem; color: #666; }
.stat .value { font-size: 1.5rem; font-weight: bold; }

.stat.presente { background: #e8f8f0; }
.stat.presente .value { color: #27ae60; }

.stat.ausente { background: #fde8e8; }
.stat.ausente .value { color: #e74c3c; }

.stat.tarde { background: #fef9e7; }
.stat.tarde .value { color: #f39c12; }

.loading, .error { padding: 2rem; text-align: center; }
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

.table th { background: #f8f9fa; font-weight: 600; }

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
}

.badge.presente { background: #e8f8f0; color: #27ae60; }
.badge.ausente { background: #fde8e8; color: #e74c3c; }
.badge.tarde { background: #fef9e7; color: #f39c12; }
.badge.eximido { background: #e8f4f8; color: #3498db; }
.badge.pending { background: #f8f9fa; color: #999; }

.btn-primary, .btn-secondary, .btn-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary { background: #3498db; color: #fff; }
.btn-secondary { background: #95a5a6; color: #fff; }

.btn-small {
  padding: 0.4rem 0.6rem;
  margin-right: 0.25rem;
  background: #ecf0f1;
  color: #333;
}

.btn-small.active { font-weight: bold; }
.btn-small.presente.active { background: #27ae60; color: #fff; }
.btn-small.ausente.active { background: #e74c3c; color: #fff; }
.btn-small.tarde.active { background: #f39c12; color: #fff; }
.btn-small.eximido.active { background: #3498db; color: #fff; }

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
  max-height: 80vh;
  overflow-y: auto;
}

.modal h2 { margin-top: 0; }

.bulk-list {
  max-height: 400px;
  overflow-y: auto;
}

.bulk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
}

.bulk-item select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}
</style>