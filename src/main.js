import Vue from 'vue'
import App from './app'
import router from './router'
import vuetify from './plugins/vuetify';
import './plugins/yvue';

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
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    $generalHandle(status, result) {
      if (status !== 200) {
        this.$toast('مشکلی پیش امده است. لطفا دوباره امتحان کنید!'); return true;
      }
    },
    $hasAccess(access) {
      return access && this.$user.permissions && this.$user.permissions.indexOf(access) >= 0;
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
    dialogs: []
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
    },
    logout() {
      localStorage.removeItem('--user--');
      this.resetCredentials();
    }
  }
}).$mount('#app')
