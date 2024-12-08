import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or 'modern'
      },
    },
  },
  build: {
    // 开发阶段启用源码映射：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#需主动开启-sourcemap
    sourcemap: process.env.NODE_ENV === 'development',
  },
  plugins: [uni()],
  server: {
    proxy: {
      // 为开发服务器配置自定义代理规则
      // 这个代理路径名称/wxapi自行修改，如/proapi
      '/wx': {
        rewrite: (path) => path.replace(/^\/wx/, ''),
        target: 'http://47.108.183.218:8080', // 目标接口，请求的根地址拿过来
        changeOrigin: true, // 是否换源
      },
    },
  },
})
