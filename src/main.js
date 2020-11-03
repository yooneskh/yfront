import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';
import Api from './api';
import { ENDPOINT_BASE, ENDPOINT_CORE } from './api/ApiBaseEndpoints';
import { Config } from './global/config';
import io from 'socket.io-client';
import VueSocketIO from 'vue-socket.io-extended';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './fonts/iryekan/iryekan.css';
import '@mdi/font/css/materialdesignicons.css';
import './assets/scss/app.scss';

Vue.config.productionTip = false;

if (Config.socket.enabled) {
  Vue.use(VueSocketIO, io(`${ENDPOINT_CORE}`, { autoConnect: false }));
}

Vue.mixin({
  computed: {
    $user() {
      return this.$root.user;
    },
    $token() {
      return this.$root.token;
    },
    $apiBase() {
      return ENDPOINT_BASE;
    }
  },
  methods: {
    $generalHandle(status, result, silent) { // eslint-disable no-unused-vars
      if (status !== 200) {
        if (!silent) this.$toast.error('There was a problem. Please try again.');
        return true;
      }
    },
    $hasAccess(access) {
      return access && this.$user.permissions?.indexOf(access) >= 0; // TODO: handle regexiness
    }
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App),
  data: {
    user: {},
    token: '',
    dialogs: []
  },
  beforeMount() {
    this.resetCredentials();
  },
  methods: {
    resetCredentials() {
      this.token = localStorage.getItem('--token--') || '';
      Api.setToken(this.$token);
    },
    logout() {
      Api.Auth.logout();
      localStorage.removeItem('--token--');
      this.resetCredentials();
    }
  }
}).$mount('#app')
