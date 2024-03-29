<template>
  <div class="main-base" :class="{ 'sidebar': appliedConfigMode === 'sidebar' }">
    <div v-if="loading" class="d-flex flex-column align-center justify-center" style="position: fixed; top: 0; left: 0; bottom: 0; right: 0;">
      <v-img src="../../assets/img/logo.png" class="flex-grow-0" contain width="60" height="60" />
      <v-progress-circular indeterminate color="primary" size="24" width="2" class="mt-4" />
    </div>
    <template v-else>

      <component
        v-if="!$route.meta.hideNavbar"
        :is="appliedConfigMode === 'appbar' ? 'main-app-bar' : 'main-side-bar'"
        :toolbar-items="permittedToolbars"
        :extra-toolbar-items="currentComponent && currentComponent.toolbars ? currentComponent.toolbars : []"
        :color="config.color"
        :height="config.appBarHeight"
        :dark="config.isDark"
        :sticky="config.stickyAppBar"
      />

      <router-view
        class="main-content"
        :key="$route.path"
        :style="{
          'padding-top': `${contentTopPadding}px`
        }"
      />

    </template>
  </div>
</template>

<script>

import MainAppBar from './components/main-app-bar.vue';
import MainSideBar from './components/main-side-bar.vue';

import { Config } from '../../global/config';
import { AuthService } from '../../api/AuthApi';

export default {
  name: 'MainBase',
  components: {
    'main-app-bar': MainAppBar,
    'main-side-bar': MainSideBar
  },
  data: () => ({
    loading: false,
    error: false,
    code: 1,
    config: {
      mode: Config.baseLayout.defaultBarMode,
      appBarHeight: Config.baseLayout.appBarHeight,
      color: Config.baseLayout.barColor,
      isDark: Config.baseLayout.isBarColorDark,
      stickyAppBar: Config.baseLayout.isAppBarSticky
    },
    toolbars: [
      { groupTitle: 'عمومی', groupIcon: 'mdi-home' , children: [
        { title: 'خانه', icon: 'mdi-home', path: '/', bar: 'topStart' },
      ]},
      { groupTitle: 'مدیریت', groupIcon: 'mdi-cog' , children: [
        { title: 'مدیریت کاربران', icon: 'mdi-account', path: '/users', bar: 'topStart', permissions: ['admin.user.list'] },
        { title: 'مدیریت فاکتورها', icon: 'mdi-cash-register', path: '/factors', permissions: ['admin.factor.list'] },
        { title: 'مدیریت پرداخت‌ها', icon: 'mdi-cash', path: '/paytickets', permissions: ['admin.payticket.list'] },
        { title: 'مدیریت حساب‌ها', icon: 'mdi-bank', path: '/accounts', permissions: ['admin.account.list'] },
        { title: 'مدیریت تراکنش‌ها', icon: 'mdi-cash-check', path: '/transactions', permissions: ['admin.transaction.list'] },
        { title: 'مدیریت انتقال‌ها', icon: 'mdi-bank-transfer', path: '/transfers', permissions: ['admin.transfer.list'] },
        { title: 'مدیریت آپدیت‌ها', icon: 'mdi-update', path: '/updates', permissions: ['admin.update.list'] }
      ]}
    ]
  }),
  computed: {
    currentComponent() {
      return this.code && this.$route?.matched?.[this.$route.matched.length - 1]?.instances?.default;
    },
    appliedConfigMode() {
      if (this.config.mode === 'appbar') return 'appbar';
      if (this.$isMobile || this.$isTablet) return 'appbar';

      return this.config.mode;

    },
    contentTopPadding() {

      const bl = Config.baseLayout;

      if (this.appliedConfigMode !== 'appbar') return bl.mainContentAreaTopSpacing;
      if (!bl.isAppBarSticky) return bl.mainContentAreaTopSpacing;

      if (!this.toolbars || this.toolbars.length === 0) {
        return bl.appBarHeight + bl.mainContentAreaTopSpacing;
      }

      if (!this.$isMobile) {
        return bl.appBarHeight + bl.appBarToolbarHeight + bl.mainContentAreaTopSpacing;
      }

      return bl.appBarHeight + bl.mainContentAreaTopSpacing;


    },
    permittedToolbars() {

      const isItemPermitted = item => {

        if (item.permissions) {
          if (!this.$hasAccesses(item.permissions)) {
            return false;
          }
        }

        if (item.anyPermissions) {
          if (!item.anyPermissions.some(it => this.$hasAccesses([it]))) {
            return false;
          }
        }

        return true;

      };

      return this.toolbars.map(bar => {
        if (!isItemPermitted(bar)) return undefined;

        return {
          ...bar,
          children: bar.children?.filter(isItemPermitted)
        };

      }).filter(Boolean);

    }
  },
  watch: {
    '$route'() {
      setTimeout(() => this.code = Math.random(), 20);
    }
  },
  async beforeMount() {

    if (!this.$token && Config.auth.isAuthMandatory) {
      this.$router.replace('/auth', () => {});
      return;
    }

    if (!this.toolbars.find(it => it.children?.some(i => i.path === this.$route.path)) && this.toolbars[0]?.children?.[0]) {
      this.$router.replace(this.toolbars[0].children[0].path, () => {});
    }

    if (Config.socket.enabled && (!Config.socket.needsAuthentication || this.$token)) {
      this.$socket.client.connect();
    }

    if (this.$token) {
      if (Config.auth.refreshIdentityOnLoad) {
        this.loading = true;
        await this.loadData();
        this.loading = false;
      }
      else {
        try {
          this.$root.$user = JSON.parse(localStorage.getItem('--user--') || '---');
        }
        catch {
          this.$toast.error('اطلاعات کاربری شما قابل بارگذاری نبود.');
          this.$root.logout(Config.auth.isAuthMandatory);
        }
      }
    }

  },
  mounted() {
    setTimeout(() => this.code = Math.random(), 20);
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
      const identityApi = await AuthService.getIdentity();
      if (identityApi.status !== 200) return this.onLoadDataError();
      this.$root.user = identityApi.data;
    },
    async onLoadDataError() {
      this.$toast.error('مشکلی در گرفتن اطلاعات شما وجود دارد. لطفا دوباره تلاش کنید.');
      this.$root.logout(Config.auth.isAuthMandatory);
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
