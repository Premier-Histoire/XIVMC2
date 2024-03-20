import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import MobileApp from "./MobileApp.vue";
import 'bootstrap/dist/css/bootstrap.css'

createApp(window.innerWidth <= 600 ? MobileApp : App).mount('#app')
