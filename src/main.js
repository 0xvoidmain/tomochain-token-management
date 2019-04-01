// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

if (process.env.NODE_ENV == 'production') {
  window.API = 'https://scan.tomochain.com/api'
}
else {
  window.API = 'https://scan.testnet.tomochain.com/api'
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
