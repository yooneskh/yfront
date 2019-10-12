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
      component: () => import('./views/auth/auth-page.vue' /* webpackChunkName: 'auth-page' */)
    },
    {
      path: '/',
      name: 'MainBase',
      component: () => import('./views/core/main-base.vue' /* webpackChunkName: 'main-base' */),
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('./views/home/home-page.vue' /* webpackChunkName: 'home-page' */)
        },
        // {
        //   path: 'users/list',
        //   name: 'ListUsers',
        //   component: () => import('./views/users/list-user-page.vue' /* webpackChunkName: 'list-user-page' */)
        // },
      ]
    },
    {
      path: '*',
      name: 'NotFound',
      component: () => import('./views/error/404-page' /* webpackChunkName: '404-page' */)
    }
  ]
});
