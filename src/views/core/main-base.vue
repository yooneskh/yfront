<template>
  <div class="main-base" :class="{ 'sidebar': appliedConfigMode === 'sidebar' }">

    <main-app-bar
      v-if="appliedConfigMode === 'appbar'"
      class="main-bar"
      :toolbar-items="toolbars"
      :color="config.color"
      :height="config.appBarHeight"
      :dark="config.isDark"
      :sticky="config.stickyAppBar"
    />

    <main-side-bar
      v-if="appliedConfigMode === 'sidebar'"
      :toolbar-items="toolbars"
      class="main-sidebar"
      :expanding-items="config.expandingSidebarItems"
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
    'main-app-bar': require('./components/main-app-bar').default,
    'main-side-bar': require('./components/main-side-bar').default
  },
  data: () => ({
    config: {
      mode: 'sidebar', // or appbar
      appBarHeight: 64,
      color: 'primary',
      isDark: true,
      stickyAppBar: false,
      expandingSidebarItems: false
    },
    toolbars: [
      { group: 'عمومی', title: 'خانه', icon: 'mdi-home', path: '/' },
      { group: 'کاربران', title: 'مدیریت کاربران', icon: 'mdi-account-group', path: '/users/list' }
    ]
  }),
  computed: {
    appliedConfigMode() {
      if (this.config.mode === 'appbar') return 'appbar';
      if (this.$isMobile || this.$isTablet) return 'appbar';

      return this.config.mode;

    },
    contentTopPadding() {

      if (this.appliedConfigMode !== 'appbar') return 12;

      if (!this.config.stickyAppBar) return 12;

      if (!this.toolbars || this.toolbars.length === 0) return this.config.appBarHeight + 12;

      return this.config.appBarHeight + 64 + 12;

    }
  },
  beforeMount() {
    if (!this.$token) {
      this.$router.replace('/auth');
    }
    else {

      this.$socket.client.connect();

      if (this.$route.name === 'MainBase') {
        this.$router.replace(this.toolbars[0].path);
      }

    }
  },
  sockets: {
    connect() {
      this.$socket.client.emit('authenticate', { token: this.$token });
    },
    authenticated() {
      console.log('authenticated');
    }
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
