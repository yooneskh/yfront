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
          path: 'users',
          component: () => import('./views/manage/manage-users-page.vue' /* webpackChunkName: 'manage-users-page' */)
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
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    else if (to.hash) {
      return {
        selector: to.hash,
        offset: {
          x: 0,
          y: 10
        }
      }
    }
    else {
      return { x: 0, y: 0 }
    }
  }
});
