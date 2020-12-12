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

// import en from 'vuetify/es5/locale/en';
import fa from 'vuetify/es5/locale/fa';

// import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '../fonts/iryekan/iryekan.css';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = new Vuetify({
  lang: {
    locales: {
      // en,
      fa
    },
    current: 'fa'
  },
  icons: {
    iconfont: 'mdi',
  },
  rtl: true,
  theme: {
    themes: {
      light: {
        primary: '#0E87CC',
        secondary: '#1B2431',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      }
    }
  }
});

export default vuetify;

Vue.use(VuetifyToast, {
  $vuetify: vuetify.framework,
  x: 'center',
  queueable: true,
  timeout: 3000
});
