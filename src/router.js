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
          path: '/profile',
          component: () => import('./views/profile/profile-base.vue' /* webpackChunkName: 'profile-base' */),
          children: [
            {
              path: '/',
              component: () => import('./views/profile/profile-part-information.vue' /* webpackChunkName: 'profile-part-information' */)
            }
          ]
        },
        {
          path: 'users',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت کاربران',
            icon: 'mdi-account',
            model: 'TourCategory'
          }
        },
        {
          path: 'factors',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت فاکتورها',
            icon: 'mdi-cash-register',
            model: 'Factor'
          }
        },
        {
          path: 'paytickets',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت پرداخت‌ها',
            icon: 'mdi-cash',
            model: 'Payticket'
          }
        },
        {
          path: 'accounts',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت حساب‌ها',
            icon: 'mdi-bank',
            model: 'Account'
          }
        },
        {
          path: 'transactions',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت تراکنش‌ها',
            icon: 'mdi-cash-check',
            model: 'Transaction'
          }
        },
        {
          path: 'transfers',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت انتقال‌ها',
            icon: 'mdi-bank-transfer',
            model: 'Transfer'
          }
        },
        {
          path: 'updates',
          component: () => import('./views/manage/manage-resource-page.vue' /* webpackChunkName: 'manage-resource-page' */),
          meta: {
            title: 'مدیریت آپدیت‌ها',
            icon: 'mdi-update',
            model: 'Update'
          }
        },
        {
          path: 'settings/application',
          component: () => import('./views/manage/manage-setting-page.vue' /* webpackChunkName: 'manage-setting-page' */),
          meta: {
            icon: 'mdi-book-cog',
            title: 'تنظیمات برنامه',
            model: 'ApplicationSetting',
            pathSuffix: '/settings/application'
          }
        },
      ]
    },
    {
      path: '*',
      component: () => import('./views/error/404-page' /* webpackChunkName: '404-page' */)
    }
  ],
  scrollBehavior(to, _from, savedPosition) {
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
