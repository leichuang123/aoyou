import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImp from 'vite-plugin-imp'
import path from "path";
const pathSrc = path.resolve(__dirname, "./src");

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    vitePluginImp({
      libList: [
        {
          libName: 'element-plus',
          style: (name) => {
            if (name === 'locale') {
              return `element-plus/lib/theme-chalk/el-option.css`
            }
            return `element-plus/lib/theme-chalk/${name}.css`
          }
        }
      ]
    })
  ],
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@import "${pathSrc}/assets/style/variables";` },
    },
  },
  alias: {
    '@': pathSrc
  },
  optimizeDeps: {
    include: ["element-plus/lib/locale/lang/zh-cn"],
  },
  server: {
    proxy: {
      '/dev': {
        target: 'https://yunnybox.yunzhiqu.com/api',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/dev/, '')
      }
    }
  },
  
})