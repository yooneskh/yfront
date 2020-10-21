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
      class="main-sidebar"
      :toolbar-items="toolbars"
      :bar-color="config.color"
      :is-color-dark="config.isDark"
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

import { Config } from '../../global/config';

export default {
  name: 'MainBase',
  components: {
    'main-app-bar': require('./components/main-app-bar').default,
    'main-side-bar': require('./components/main-side-bar').default
  },
  data: () => ({
    config: {
      mode: Config.baseLayout.defaultBarMode,
      appBarHeight: Config.baseLayout.appBarHeight,
      color: Config.baseLayout.barColor,
      isDark: Config.baseLayout.isBarColorDark,
      stickyAppBar: Config.baseLayout.isAppBarSticky
    },
    toolbars: [
      { groupTitle: 'عمومی', groupIcon: 'mdi-home' , children: [
        { title: 'خانه', icon: 'mdi-home', path: '/' },
      ]},
      { groupTitle: 'کاربران', groupIcon: 'mdi-account-group' , children: [
        { title: 'مدیریت کاربران', icon: 'mdi-account-group', path: '/users' },
      ]}
    ]
  }),
  computed: {
    appliedConfigMode() {
      if (this.config.mode === 'appbar') return 'appbar';
      if (this.$isMobile || this.$isTablet) return 'appbar';

      return this.config.mode;

    },
    contentTopPadding() {
      if (this.appliedConfigMode !== 'appbar') return Config.baseLayout.mainContentAreaTopSpacing;
      if (!this.config.stickyAppBar) return Config.baseLayout.mainContentAreaTopSpacing;

      if (!this.toolbars || this.toolbars.length === 0) {
        return this.config.appBarHeight + Config.baseLayout.mainContentAreaTopSpacing;
      }

      return this.config.appBarHeight + Config.baseLayout.appBarToolbarHeight + Config.baseLayout.mainContentAreaTopSpacing;

    }
  },
  beforeMount() {
    if (!this.$token && Config.auth.isAuthMandatory) {
      this.$router.replace('/auth');
    }
    else if (Config.socket.enabled && (!Config.socket.needsAuthentication || this.$token)) {
      this.$socket.client.connect();
    }
  },
  sockets: {
    connect() {
      if (Config.socket.needsAuthentication) {
        this.$socket.client.emit('authenticate', { token: this.$token });
      }
    },
    authenticated() {
    //   this.$socket.client.emit('subscribe', 'Resource.User.*');
    },
    // 'Resource.User.*'(...data) {
    //
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
