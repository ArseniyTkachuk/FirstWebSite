
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './routers'   // імпортуємо наш маршрутизатор

const app = createApp(App)

// підключаємо роутер до Vue
app.use(router)

app.mount('#app')  // монтуємо додаток у div з id="app" у index.html

