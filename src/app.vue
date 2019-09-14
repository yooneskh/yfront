<template>
  <v-app class="app-base">
    <router-view />
    <y-dialog-container />
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationBase',
  components: {
    'y-dialog-container': () => import('./plugins/ydialog-container.vue')
  }
};
</script>

<style lang="scss" scoped>
  .app {
    background: rgba(black, 0.2);
    .flexible-view {
      background: white;
    }
  }
</style>
