import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 本地开发用 `/`；GitHub Pages「项目站」地址为 https://<用户>.github.io/<仓库名>/
// 部署时在 workflow 里设置 BASE_PATH=/<仓库名>/（必须以 / 结尾）
// 若仓库名为 <用户名>.github.io 且要做用户主页，BASE_PATH 设为 /
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  plugins: [vue()],
  base,
})
