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

Vue.config.productionTip = false

Vue.mixin({
  computed: {
    $user() {
      return this.$root.user;
    },
    $token() {
      return this.$root.user.token;
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
      return access && this.$user.permissions && this.$user.permissions.indexOf(access) >= 0; // TODO: handle regexiness
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
      profile: {},
      permissions: [],
      phoneNumber: '',
      token: ''
    },
    dialogs: [] // TODO: make this in the plugin file
  },
  beforeMount() {
    this.resetCredentials();
  },
  methods: {
    resetCredentials() {

      Object.assign(this.user, JSON.parse(localStorage.getItem('--user--') || JSON.stringify({
        _id: '',
        firstName: '',
        lastName: '',
        profile: {},
        permissions: [],
        phoneNumber: '',
        token: ''
      })));

      Api.setToken(this.$token);

    },
    logout() {
      localStorage.removeItem('--user--');
      this.resetCredentials();
    }
  }
}).$mount('#app')
