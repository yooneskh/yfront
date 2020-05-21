import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';
import Api from './api';
import { ENDPOINT_BASE } from './api/ApiBaseEndpoints';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import './fonts/iryekan/iryekan.css';
import '@mdi/font/css/materialdesignicons.css';
import './assets/scss/app.scss';

Vue.config.productionTip = false;

// import { ENDPOINT_CORE } from './api/ApiBaseEndpoints';
// import io from 'socket.io-client';
// import VueSocketIO from 'vue-socket.io-extended';
// Vue.use(VueSocketIO, io(`${ENDPOINT_CORE}`, { autoConnect: false }));

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
    // eslint-disable-next-line no-unused-vars
    $generalHandle(status, result, silent) {
      if (status !== 200) {
        
        if (!silent) {
          this.$toast.error('مشکلی پیش آمده است! لطفا دوباره امتحان کنید.');
        }
        
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
    user: {
      _id: '',
      name: '',
      profilePicture: {},
      permissions: [],
      phoneNumber: '',
    },
    token: '',
    dialogs: [] // TODO: make this in the plugin file
  },
  beforeMount() {
    this.resetCredentials();
  },
  methods: {
    resetCredentials() {

      this.user = JSON.parse(localStorage.getItem('--user--') || JSON.stringify({
        _id: '',
        name: '',
        profilePicture: {},
        permissions: [],
        phoneNumber: '',
      }));

      this.token = localStorage.getItem('--token--') || '';

      Api.setToken(this.$token);

    },
    logout() {
      localStorage.removeItem('--user--');
      localStorage.removeItem('--token--');
      this.resetCredentials();
    }
  }
}).$mount('#app')
