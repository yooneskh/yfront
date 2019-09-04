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
        //   path: 'places/new',
        //   name: 'NewPlace',
        //   component: () => import('./views/places/new-place-page.vue' /* webpackChunkName: 'new-place-page' */)
        // },
        // {
        //   path: 'places/list',
        //   name: 'ListPlaces',
        //   component: () => import('./views/places/list-place-page.vue' /* webpackChunkName: 'list-place-page' */)
        // },
      ]
    },
  ]
});
