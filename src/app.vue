<template>
  <v-app class="app-base">
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationBase'
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
