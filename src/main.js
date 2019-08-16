import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';

import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

import './assets/scss/app.scss';

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    $token() {
      return this.$root.user.token;
    },
    // eslint-disable-next-line no-unused-vars
    $generalHandle(status, result) {
      if (status !== 200) {
        alert('Something went wrong!'); return true;
      }
    }
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App),
  data: {
    user: {
      _id: '',
      firstName: '',
      lastName: '',
      permissions: '',
      phoneNumber: '',
      token: ''
    }
  },
  methods: {
    resetCredentials() {
      Object.assign(this.user, JSON.parse(localStorage.getItem('--user--') || '{}'));
    }
  }
}).$mount('#app')
