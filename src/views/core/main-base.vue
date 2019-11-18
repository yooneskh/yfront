<template>
  <!-- <div class="main-base">
    <main-app-bar class="main-bar" /> -->
  <div class="main-base sidebar">
    <main-side-bar class="main-sidebar" />
    <router-view class="main-content" />
  </div>
</template>

<script>
export default {
  name: 'MainBase',
  components: {
    'main-app-bar': () => import('./components/main-app-bar' /* webpackChunkName: 'main-app-bar' */),
    'main-side-bar': () => import('./components/main-side-bar' /* webpackChunkName: 'main-side-bar' */)
  },
  beforeMount() {
    if (!this.$token) {
      this.$router.replace('/auth');
    }
    // else if (this.$route.name === 'MainBase') {
    //   this.$router.replace(this.toolbars[0].path);
    // }
  }
}
</script>

<style lang="scss" scoped>
  .main-base {
    background: transparent;
  }
  .main-base.sidebar {
    display: flex;
    flex-direction: row;
    height: 100%;
    max-height: 100%;
    .main-content {
      height: 100%;
      max-height: 100%;
      overflow-y: auto;
    }
  }
</style>
