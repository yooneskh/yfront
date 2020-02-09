import Vue from 'vue';
import moment from 'moment-jalaali';
import YDialog from './ydialog';
import UUIDV4 from 'uuid/v4';
import YNetwork from 'ynetwork';
import copyToClipboard from 'copy-to-clipboard';
import UserPlaceholder from '../assets/img/user-placeholder.jpeg';

// import VueAnalytics from 'vue-analytics';
// Vue.use(VueAnalytics, { id: '---' });

YNetwork.debug = true;

moment.loadPersian({ dialect: 'persian-modern' });

Vue.component('y-form', () => import('../components/y-form-vuetify' /* webpackChunkName: 'y-form' */));
Vue.component('y-table', () => import('../components/y-table' /* webpackChunkName: 'y-table' */));

function formatTime(time, format) {
  return moment(time || undefined).format(format)
}

function truncate(lengthy, truncateLength) {

  if (!lengthy || !lengthy.length || lengthy.length <= truncateLength) return lengthy;

  return lengthy.slice(0, truncateLength) + ' ...';

}


Vue.filter('truncate', truncate);
Vue.filter('formatTime', formatTime);

Vue.mixin({
  computed: {
    $userPlaceholder() {
      return UserPlaceholder;
    },
    $isMobile() {
      return !!this.$vuetify?.breakpoint.smAndDown;
    },
    $isTablet() {
      return !!this.$vuetify?.breakpoint.mdOnly;
    },
    $isDesktop() {
      return !!this.$vuetify?.breakpoint.lgAndUp;
    }
  },
  methods: {
    $log(...args) {
      alert(JSON.stringify(args));
    },
    $formatTime(time, format) {
      return formatTime(time, format);
    },
    $truncate(lengthy, truncateLength) {
      return truncate(lengthy, truncateLength);
    },
    $uuid() {
      return UUIDV4();
    },
    $copy(text) {
      return copyToClipboard(text);
    },
    $confirmDeleteDialog(title, options) {
      return this.$dialog(import('../dialogs/confirm-delete.vue' /* webpackChunkName: 'confirm-delete-dialog' */), {
        ...options,
        title
      });
    },
    $formMakerDialog(title, fields, actionTitle, values, options) {
      return this.$dialog(import('../dialogs/form-maker.vue' /* webpackChunkName: 'form-maker-dialog' */), {
        ...options,
        title,
        fields,
        actionTitle,
        values
      });
    },
    $listPickerDialog(title, items, options) {
      return this.$dialog(import('../dialogs/list-picker.vue' /* webpackChunkName: 'list-picker-dialog' */), {
        ...options,
        title,
        items
      });
    }
  }
});

Vue.use(YDialog);
