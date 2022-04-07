import { defineConfig, loadEnv } from 'vite'
import { resolve } from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import viteSvgIcons from 'vite-plugin-svg-icons'
import path from 'path'
import proxyTable from './config/proxy'


// https://vitejs.dev/config/
export default ({ mode }) => ({
  base: './',
  plugins: [
    vue(),
    vueJsx({}),
    viteSvgIcons({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
    }),
  ],
  server: {
    open: true,
    port: 19030,
    proxy: proxyTable(loadEnv(mode, process.cwd())),
    hmr: {},
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '~': resolve(__dirname, './src'),
      '@api': resolve(__dirname, './src/api'),
      '@components': resolve(__dirname, '/src/components'),
      '@views': resolve(__dirname, '/src/views'),
      '@static': resolve(__dirname, '/src/static'),
    },
  },
  build: {
    assetsDir: 'static',
    rollupOptions: {
      include: [],
    },
  },
  optimizeDeps: {
    exclude: [],
  },
})
