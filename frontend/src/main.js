import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import axios from "axios"
import Cookies from "js-cookie"

Vue.config.productionTip = false

axios.defaults.headers.common = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'Authorization': Cookies.get('access_token')
}

axios.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response.status == 401)
    router.push("/login");
  // return Promise.reject(error.message);
});

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')