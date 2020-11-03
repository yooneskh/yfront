<template>
  <div class="main-base" :class="{ 'sidebar': appliedConfigMode === 'sidebar' }">
    <template v-if="loading">
      <v-img src="../../assets/img/logo.png" class="flex-grow-0" contain width="60" height="60" />
      <v-progress-circular indeterminate color="primary" size="24" width="2" class="mt-4" />
    </template>
    <template v-else>

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

    </template>
  </div>
</template>

<script>

import { Config } from '../../global/config';
import Api from '../../api';

export default {
  name: 'MainBase',
  components: {
    'main-app-bar': require('./components/main-app-bar').default,
    'main-side-bar': require('./components/main-side-bar').default
  },
  data: () => ({
    loading: false,
    error: false,
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
      { groupTitle: 'مدیریت', groupIcon: 'mdi-cog' , children: [
        { title: 'مدیریت کاربران', icon: 'mdi-account', path: '/users' },
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
  async beforeMount() {

    if (!this.$token && Config.auth.isAuthMandatory) {
      this.$router.replace('/auth');
      return;
    }

    if (Config.socket.enabled && (!Config.socket.needsAuthentication || this.$token)) {
      this.$socket.client.connect();
    }

    if (this.$token) {
      this.loading = true;
      await this.loadData();
      this.loading = false;
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
  },
  methods: {
    async loadData() {
      const identityApi = await Api.Auth.getIdentity();
      if (identityApi.status !== 200) return this.onLoadDataError();
      this.$root.user = identityApi.result;
    },
    async onLoadDataError() {
      this.$toast.error('مشکلی در گرفتن اطلاعات شما وجود دارد. لطفا دوباره تلاش کنید.');
      this.$root.logout();
      this.$router.replace('/auth');
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-base {
    background: #EAEAEA;
    .loading-container {
      position: fixed;
      top: 0; right: 0; bottom: 0; left: 0;
    }
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
