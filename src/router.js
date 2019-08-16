import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      name: 'Auth',
      component: () => import('./views/auth/auth-page.vue' /* webpackChunkName: 'authpage' */)
    },
    {
      path: '/',
      name: 'MainBase',
      component: () => import('./views/core/main-base.vue' /* webpackChunkName: 'mainbase' */),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('./views/home/home-page.vue' /* webpackChunkName: 'homepage' */)
        }
      ]
    },
  ]
});
