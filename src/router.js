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
          path: 'users/list',
          name: 'ListUsers',
          component: () => import('./views/users/list-user-page.vue' /* webpackChunkName: 'list-user-page' */)
        },
        {
          path: 'handouts/list',
          name: 'ListHandouts',
          component: () => import('./views/handouts/list-handout-page.vue' /* webpackChunkName: 'list-handout-page' */)
        },
        {
          path: 'categorys/list',
          name: 'ListCategorys',
          component: () => import('./views/categorys/list-category-page.vue' /* webpackChunkName: 'list-category-page' */)
        },
        {
          path: 'tags/list',
          name: 'ListTags',
          component: () => import('./views/tags/list-tag-page.vue' /* webpackChunkName: 'list-tag-page' */)
        },
      ]
    },
  ]
});
