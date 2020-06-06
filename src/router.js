import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/auth',
      component: () => import('./views/auth/auth-page.vue' /* webpackChunkName: 'auth-page' */)
    },
    {
      path: '/',
      component: () => import('./views/core/main-base.vue' /* webpackChunkName: 'main-base' */),
      children: [
        {
          path: '/',
          component: () => import('./views/home/home-page.vue' /* webpackChunkName: 'home-page' */)
        },
        {
          path: 'users/list',
          component: () => import('./views/users/list-user-page.vue' /* webpackChunkName: 'list-user-page' */)
        },
      ]
    },
    {
      path: '/payment/verify',
      component: () => import('./views/general/verify-payment-page.vue' /* webpackChunkName: 'verify-payment' */)
    },
    {
      path: '*',
      component: () => import('./views/error/404-page' /* webpackChunkName: '404-page' */)
    }
  ]
});
