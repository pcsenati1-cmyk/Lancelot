<script setup>
</script>

<template>
  <nav class="navbar">
    <router-link to="/" class="logo">Sistema de Asistencias</router-link>
    <div class="nav-links">
      <router-link to="/">Inicio</router-link>
      <router-link to="/estudiantes">Estudiantes</router-link>
      <router-link to="/asistencias">Asistencias</router-link>
    </div>
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f6fa;
  color: #333;
  line-height: 1.6;
}
</style>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #2c3e50;
}

.logo {
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  color: #ecf0f1;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #34495e;
}

main {
  min-height: calc(100vh - 60px);
}
</style>