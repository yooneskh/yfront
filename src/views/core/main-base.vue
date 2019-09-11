<template>
  <div class="main-base" style="position: relative;">

    <v-app-bar class="main-bar" :class="{'has-tabs-icons': !$isMobile}" color="primary" dark>

      <v-toolbar-title>اپلیکیشن من</v-toolbar-title>

      <v-btn class="ms-4" text @click="$router.replace('/home', () => {})">
        خانه
      </v-btn>

      <v-spacer />

      <v-btn icon v-if="!$token" @click="$router.replace('/auth', () => {})">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      
      <v-menu v-else offset-y>

        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" class="px-0" style="min-width: unset;">
            <v-avatar size="24" class="mt-1 me-1 ms-1"> <img :src="$user.profile.path || 'http://www.lakeportmetalcraft.com/wp-content/uploads/2018/10/user-placeholder.png'" alt="owner image avatar" /> </v-avatar>
            <span v-if="!$isMobile" class="pe-1">{{ $user.firstName + ' ' + $user.lastName }}</span>
          </v-btn>
        </template>

        <v-list dense>

          <v-list-item @click="$router.push(`/user/${$user._id}`)">
            <v-list-item-title>مشاهده پروفایل</v-list-item-title>
          </v-list-item>
          
          <!-- <v-divider /> -->

          <v-list-item @click="$root.logout(); $router.replace('/auth')">
            <v-list-item-title>خروج از حساب کاربری</v-list-item-title>
          </v-list-item>

        </v-list>

      </v-menu>

      <!-- <template v-slot:extension>
        <v-tabs class="main-tabs" background-color="transparent" icons-and-text>

          <v-tabs-slider color="white" />

          <v-tab v-for="(toolbarItem, index) in toolbars" :key="toolbarItem.path" :class="{'ms-0': index === 0}" @click="$router.push(toolbarItem.path, () => {})">
            {{ toolbarItem.title }}
            <v-icon v-if="!$isMobile" class="mb-0">{{ toolbarItem.icon }}</v-icon>
          </v-tab>

        </v-tabs>
      </template> -->

    </v-app-bar>

    <y-flexible-view no-shadow>

      <router-view class="main-content" />

      <div class="bottom-spacer">
        تهیه شده توسط یونس خوش قدم
      </div>

    </y-flexible-view>

  </div>
</template>

<script>
export default {
  name: 'MainBase',
  components: {
    'y-flexible-view': () => import('../../components/y-flexible-view' /* webpackChunkName: 'y-flexible-view' */)
  },
  data: () => ({
    // toolbars: [
      // { path: '/places/list', title: 'لیست مکان ها', icon: 'mdi-city' },
      // { path: '/places/new', title: 'افزودن مکان جدید', icon: 'mdi-bank-plus' },
    // ]
  }),
  beforeMount() {
    if (!this.$token) {
      this.$router.replace('/auth');
    }
    else if (this.$route.name === 'MainBase') {
      this.$router.replace('/home');
    }
    // else if (this.$route.name === 'MainBase') {
    //   this.$router.replace(this.toolbars[0].path);
    // }
  }
}
</script>

<style lang="scss" scoped>
  .main-base {
    height: 100%;
    display: flex;
    flex-direction: column;
    .main-bar {
      flex-grow: 0;
      z-index: 1;
    }
    .y-flexible-view {
      overflow-y: auto;
      flex-grow: 1;
      z-index: 0;
      height: 0px;
      .main-content {
        min-height: 100%;
        min-height: calc(100% - 56px);
      }
      .bottom-spacer {
        width: 100%;
        height: 56px;
        box-sizing: border-box;
        text-align: center;
        padding: 16px;
        font-size: 0.85em;
        color: rgba(black, 0.3);
      }
    }
  }
</style>
