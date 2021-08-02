import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';
import { hasPermissions } from './util/permissions';
import { ApiHelper } from './api';
import { AuthService } from './api/AuthApi';
import { ENDPOINT_BASE } from './api/ApiBaseEndpoints';
import './assets/scss/app.scss';

import VueAsyncComputed from 'vue-async-computed'
import { unmakeIt } from './util/encryption';
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
    $generalHandle(status, result, silent) {
      if (status !== 200) {
        if (!silent) this.$toast.error(result?.message || 'مشکلی پیش آمده. لطفا دوباره تلاش کنید.');
        return true;
      }
    },
    $hasAccesses(accesses) {
      if (!this.$user || !this.$user.permissions) return false;
      return hasPermissions(this.$user.permissions, accesses);
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
      this.token = unmakeIt(localStorage.getItem('--token--') || '');
      ApiHelper.setToken(this.$token);
    },
    logout(redirect = true) {

      AuthService.logout();

      localStorage.removeItem('--token--');
      this.$root.token = '';
      this.$root.user = {};

      this.resetCredentials();
      if (redirect) this.$router.replace('/auth');

    }
  }
}).$mount('#app')
