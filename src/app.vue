<template>
  <v-app class="app-base">
    <router-view />
    <y-dialog-container v-if="$root.dialogs.length > 0" />
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationBase',
  components: {
    'y-dialog-container': require('./plugins/ydialog-container.vue').default
  }
};
</script>
