// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import VueSocketio from 'vue-socket.io';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import { util } from './assets/js/util.js';

/**
 * 引入公用css
 */
import '@/assets/css/base.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
axios.defaults.withCredentials =  true;
Vue.prototype.http = axios;
Vue.prototype.util = util;
Vue.use(VueSocketio, 'http://192.168.1.26:7001/user');
Vue.prototype.baseUrl = 'http://192.168.1.26:7001';
// Vue.http.defaults.headers.post['Content-Type'] = 'application/json';
/* eslint-disable no-new */
window.vue = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  mounted(){
    // console.log(Vue);
  }
})
