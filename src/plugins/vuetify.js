import Vue from 'vue';
import Vuetify, { VSnackbar, VBtn, VIcon } from 'vuetify/lib'
import VuetifyToast from 'vuetify-toast-snackbar';

Vue.use(Vuetify, {
  components: {
    VSnackbar,
    VBtn,
    VIcon
  }
});

const isRtl = true; // TODO: make dependant to main rtlish

Vue.use(VuetifyToast, {
  queueable: true,
  timeout: 3000,
  classes: [isRtl ? 'is-rtl' : '']
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  rtl: isRtl,
  theme: {
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      }
    }
  }
});
