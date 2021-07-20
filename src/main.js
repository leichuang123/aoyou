import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper.less'
import 'vue-photo-preview/dist/skin.css'
import './assets/style/init.less'
import vuetify from './plugins/vuetify';
import Spin from './plugins/Spin'
import preview from 'vue-photo-preview'
import Message from 'vue-multiple-message'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

import {
  Cascader,
} from 'element-ui'

Vue.use(Cascader)

Vue.prototype.$message = Message

Vue.use(preview, {
  // escKey: false,
  loop: true,
  bgOpacity: 0.7,
  fullscreenEl: false,
})
Vue.use(Spin)
Vue.config.productionTip = false
Vue.use(VueAwesomeSwiper)


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
