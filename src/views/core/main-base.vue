<template>
  <div class="main-base" :class="{ 'sidebar': config.mode === 'sidebar' }">

    <main-app-bar
      v-if="config.mode === 'appbar'"
      class="main-bar"
      :toolbar-items="toolbars"
      :color="config.color"
      :height="config.appBarHeight"
      :dark="config.isDark"
      :sticky="config.stickyAppBar"
    />

    <main-side-bar
      v-if="config.mode === 'sidebar'"
      :toolbar-items="toolbars"
      class="main-sidebar"
    />

    <router-view
      class="main-content"
      :style="{
        'padding-top': `${contentTopPadding}px`
      }"
    />

  </div>
</template>

<script>
export default {
  name: 'MainBase',
  components: {
    'main-app-bar': () => import('./components/main-app-bar' /* webpackChunkName: 'main-app-bar' */),
    'main-side-bar': () => import('./components/main-side-bar' /* webpackChunkName: 'main-side-bar' */)
  },
  data: () => ({
    config: {
      mode: 'sidebar', // or appbar
      appBarHeight: 64,
      color: 'primary',
      isDark: true,
      stickyAppBar: true
    },
    toolbars: [
      { group: 'عمومی', title: 'خانه', icon: 'mdi-home', path: '/' },
      { group: 'کاربران', title: 'مذیریت کاربران', icon: 'mdi-account-group', path: '/users/list' }
    ]
  }),
  computed: {
    contentTopPadding() {

      if (this.config.mode !== 'appbar') return 12;

      if (!this.config.stickyAppBar) return 12;

      if (!this.toolbars || this.toolbars.length === 0) return this.config.appBarHeight + 12;

      return this.config.appBarHeight + 64 + 12;

    }
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
    background: #EAEAEA;
    &:not(.sidebar) {
      min-height: 100%;
    }
    &.sidebar {
      display: flex;
      flex-direction: row;
      height: 100%;
      max-height: 100%;
      .main-sidebar {
        flex-grow: 0;
        flex-shrink: 0;
      }
      .main-content {
        height: 100%;
        max-height: 100%;
        overflow-y: auto;
      }
    }
  }
</style>
