import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueRouter from 'vue-router'
import routes from './routes'



Vue.use(VueRouter)
Vue.use(require('vue-moment'));


const router = new VueRouter ({
  mode: 'history',
  routes: routes
});

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
