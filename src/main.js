import { createApp } from 'vue'
import App from './App.vue'
import './index.scss'
import router from './router/index'
import vuex from './store/index'
import request from './plugin/request/index'
import myLoading from './plugin/loading'
import lang from "element-plus/lib/locale/lang/zh-cn"
import "dayjs/locale/zh-cn"
import { locale } from "element-plus"
import "element-plus/lib/theme-chalk/index.css"
locale(lang)
const app = createApp(App)
app.use(router)
app.use(vuex)
app.use(request)
app.use(myLoading)

app.mount('#app')


