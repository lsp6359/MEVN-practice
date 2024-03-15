import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';


import axios from 'axios'
// vue에서 axios를 사용하기위해 vue-axios 필요
import VueAxios from 'vue-axios'

Vue.use(VueAxios,axios)
Vue.config.productionTip = false
Vue.prototype.$bus=new Vue()

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
