import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import TokenDetail from '@/components/TokenDetail';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/tokendetail/:address',
      name: 'TokenDetail',
      component: TokenDetail
    }
  ]
})
