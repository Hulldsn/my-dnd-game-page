import { createRouter, createWebHistory } from 'vue-router'
import GameProjectView from '../views/GameProjectView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GameProjectView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

