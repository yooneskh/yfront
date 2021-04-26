<template>
  <v-app class="app-base">
    <router-view />
    <y-dialog-container v-if="$root.dialogs.length > 0" />
  </v-app>
</template>

<script>

import YDialogContainer from './plugins/ydialog-container.vue';

export default {
  name: 'ApplicationBase',
  components: {
    'y-dialog-container': YDialogContainer
  }
};

</script>
