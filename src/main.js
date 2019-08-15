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
    }
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App),
  data: {
    user: {
      token: ''
    }
  }
}).$mount('#app')
