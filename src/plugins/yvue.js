import Vue from 'vue';
import moment from 'moment-jalaali';
import YDialog from './ydialog';
import { v4 as UUIDV4 } from 'uuid';
import { YNetwork } from 'ynetwork';
import copyToClipboard from 'copy-to-clipboard';
import UserPlaceholder from '../assets/img/user-placeholder.jpeg';

// import VueAnalytics from 'vue-analytics';
// Vue.use(VueAnalytics, { id: '---' });

YNetwork.setDebug(process.env.NODE_ENV !== 'production');

moment.loadPersian({ dialect: 'persian-modern' });

import YForm from '../components/y-form/y-form';
Vue.component('y-form', YForm);
Vue.component('y-table', () => import('../components/y-table' /* webpackChunkName: 'y-table' */));

function downloadAsFile(filename, text) {

  const element = document.createElement('a');

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  element.setAttribute('href', url);
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);

}

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
    $range(start, end) {

      const _start = end !== undefined ? start : 0;
      const _end = end !== undefined ? end : start;

      const result = _start + ( Math.random() * (_end - _start) );

      if (!Number.isSafeInteger(_start) || !Number.isSafeInteger(_end)) return result;
      return Math.trunc(result);

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
    $downloadAsFile(filename, text) {
      return downloadAsFile(filename, text);
    },
    $dialogConfirmDelete({ title, message, options } = {}) {
      return this.$dialog(import('../dialogs/confirm-delete.vue' /* webpackChunkName: 'confirm-delete-dialog' */), {
        ...options,
        title,
        message
      });
    },
    $dialogFormMaker({ title, description, fields, actionTitle, values, options } = {}) {
      return this.$dialog(import('../dialogs/form-maker.vue' /* webpackChunkName: 'form-maker-dialog' */), {
        ...options,
        title,
        description,
        fields,
        actionTitle,
        values
      });
    },
    $dialogListPicker({ icon, title, body, items, readonly, navigation, options } = {}) {
      return this.$dialog(import('../dialogs/list-picker.vue' /* webpackChunkName: 'list-picker-dialog' */), {
        ...options,
        icon,
        title,
        body,
        items,
        readonly,
        navigation
      });
    },
    $dialogYesNo({ icon, title, message, danger, yesText, noText, yesValue, noValue, options } = {}) {
      return this.$dialog(import('../dialogs/yes-no-dialog.vue' /* webpackChunkName: 'yes-no-dialog' */), {
        ...options,
        icon,
        title,
        message,
        danger,
        yesText,
        noText,
        yesValue,
        noValue
      });
    },
    $dialogOk({ icon, title, message, danger, text, value, options } = {}) {
      return this.$dialog(import('../dialogs/ok-dialog.vue' /* webpackChunkName: 'ok-dialog' */), {
        ...options,
        icon,
        title,
        message,
        danger,
        text,
        value
      });
    },
    $dialogTable({ icon, title, headers, items, actions, options } = {}) {
      return this.$dialog(import('../dialogs/table-dialog.vue' /* webpackChunkName: 'table-dialog' */), {
        ...options,
        icon,
        title,
        headers,
        items,
        actions
      });
    }
  }
});

Vue.use(YDialog);
