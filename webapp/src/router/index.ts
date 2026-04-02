import { createRouter, createWebHistory } from 'vue-router'
import GameProjectView from '../views/GameProjectView.vue'

export const router = createRouter({
  // 与 vite.config.ts 的 base 一致；GitHub Pages 项目站为 /<仓库名>/，避免跳到 hulldsn.github.io/ 根路径导致 404
  history: createWebHistory(import.meta.env.BASE_URL),
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

