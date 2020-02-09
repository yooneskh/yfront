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

Vue.use(VuetifyToast, {
  x: 'center',
  queueable: true,
  timeout: 300000
});

import en from 'vuetify/es5/locale/en';
import fa from 'vuetify/es5/locale/fa';

export default new Vuetify({
  lang: {
    locales: { en, fa },
    current: 'fa'
  },
  icons: {
    iconfont: 'mdi',
  },
  rtl: true,
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
