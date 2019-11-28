<template>
  <v-app class="app-base">
    <router-view />
    <y-dialog-container v-if="$root.dialogs.length > 0" style="position: fixed;" />
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationBase',
  components: {
    'y-dialog-container': () => import('./plugins/ydialog-container.vue' /* webpackChunkName: 'y-dialog-container' */)
  }
};
</script>
