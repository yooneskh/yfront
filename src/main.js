import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';
import Api from './api';
import { ENDPOINT_BASE } from './api/ApiBaseEndpoints';
import './assets/scss/app.scss';

import VueAsyncComputed from 'vue-async-computed'
Vue.use(VueAsyncComputed);

// import io from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io-extended';
// import { Config } from './global/config';
// Vue.use(VueSocketIO, io(`${ENDPOINT_CORE}`, { autoConnect: false }));

Vue.config.productionTip = false;

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
    $generalHandle(status, _result, silent) {
      if (status !== 200) {
        if (!silent) this.$toast.error('مشکلی پیش آمده. لطفا دوباره تلاش کنید.');
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
      this.$root.token = '';
      this.$root.user = {};
      this.resetCredentials();
    }
  }
}).$mount('#app')
