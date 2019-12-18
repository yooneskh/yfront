import Vue from 'vue';
import moment from 'moment-jalaali';
import YDialog from './ydialog';
import UUIDV4 from 'uuid/v4';
import YNetwork from 'ynetwork';
import copyToClipboard from 'copy-to-clipboard';

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
    $isMobile() {
      return this.$vuetify && this.$vuetify.breakpoint.smAndDown;
    },
    $isTablet() {
      return this.$vuetify && this.$vuetify.breakpoint.mdOnly;
    },
    $isDesktop() {
      return this.$vuetify && this.$vuetify.breakpoint.lgAndUp;
    }
  },
  methods: {
    $log(...args) {
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
    }
  }
});

Vue.use(YDialog);
