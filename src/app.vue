<template>
  <v-app style="background: rgba(black, 0.2);">
    <y-flexible-view style="background: white;">
      <router-view />
    </y-flexible-view>
  </v-app>
</template>

<script>
export default {
  name: 'ApplicationBase',
  components: {
    'y-flexible-view': () => import('./components/y-flexible-view')
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
