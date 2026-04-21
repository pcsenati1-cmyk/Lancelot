<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const health = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/health');
    health.value = response.data;
  } catch (err) {
    error.value = 'No se pudo conectar al backend. Asegúrate de que el servidor esté corriendo.';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="home">
    <h1>Sistema de Gestión de Asistencias</h1>
    
    <div v-if="loading" class="loading">Cargando...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="health" class="health-check">
      <div class="status success">✓ Sistema activo</div>
      <p>{{ health.message }}</p>
      <p class="version">Versión: {{ health.version }}</p>
    </div>
    
    <div class="menu">
      <router-link to="/estudiantes" class="card">
        <h2>👥 Estudiantes</h2>
        <p>Gestionar registro de estudiantes</p>
      </router-link>
      <router-link to="/asistencias" class="card">
        <h2>📋 Asistencias</h2>
        <p>Registro y seguimiento de asistencia</p>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.loading {
  text-align: center;
  color: #666;
}

.error {
  color: #e74c3c;
  padding: 1rem;
  background: #fde8e8;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.health-check {
  padding: 1rem;
  background: #e8f8f0;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.status {
  font-weight: bold;
  color: #27ae60;
}

.version {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.card {
  display: block;
  padding: 2rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card h2 {
  margin: 0 0 0.5rem;
  color: #2c3e50;
}

.card p {
  margin: 0;
  color: #666;
}
</style>