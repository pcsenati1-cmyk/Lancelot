import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Estudiantes from '../views/Estudiantes.vue';
import Asistencias from '../views/Asistencias.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/estudiantes', name: 'Estudiantes', component: Estudiantes },
  { path: '/asistencias', name: 'Asistencias', component: Asistencias }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;