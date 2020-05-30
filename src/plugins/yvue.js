import Vue from 'vue';
import moment from 'moment-jalaali';
import YDialog from './ydialog';
import { v4 as UUIDV4 } from 'uuid';
import YNetwork from 'ynetwork';
import copyToClipboard from 'copy-to-clipboard';
import UserPlaceholder from '../assets/img/user-placeholder.jpeg';

// import VueAnalytics from 'vue-analytics';
// Vue.use(VueAnalytics, { id: '---' });

YNetwork.debug = process.env.NODE_ENV !== 'production';

moment.loadPersian({ dialect: 'persian-modern' });

Vue.component('y-form', require('../components/y-form-vuetify').default);
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
    $alert(thing) {
      alert(thing);
    },
    $log(...args) {
      // eslint-disable-next-line no-console
      console.log(...args);
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
    $dialogConfirmDelete(title, options) {
      return this.$dialog(import('../dialogs/confirm-delete.vue' /* webpackChunkName: 'confirm-delete-dialog' */), {
        ...options,
        title
      });
    },
    $dialogFormMaker(title, description, fields, actionTitle, values, options) {
      return this.$dialog(import('../dialogs/form-maker.vue' /* webpackChunkName: 'form-maker-dialog' */), {
        ...options,
        title,
        description,
        fields,
        actionTitle,
        values
      });
    },
    $dialogListPicker(title, items, options) {
      return this.$dialog(import('../dialogs/list-picker.vue' /* webpackChunkName: 'list-picker-dialog' */), {
        ...options,
        title,
        items
      });
    }
  }
});

Vue.use(YDialog);
