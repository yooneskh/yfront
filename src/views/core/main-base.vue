<template>
  <div class="main-base">

    <v-app-bar class="main-bar" :class="{'has-tabs-icons': !$isMobile && $data.toolbars && toolbars.length > 0}" color="primary" dark>

      <v-toolbar-title>پنل مدیریت</v-toolbar-title>

      <!-- <v-btn class="ms-4" text @click="$router.replace('/home', () => {})">
        خانه
      </v-btn> -->

      <v-spacer />

      <v-btn icon v-if="!$token" @click="$router.replace('/auth', () => {})">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      
      <v-menu v-else offset-y>

        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" class="px-0" style="min-width: unset;">
            <v-avatar size="24" class="mt-1 me-2 ms-2"> <img :src="$user.profile.path || 'http://www.lakeportmetalcraft.com/wp-content/uploads/2018/10/user-placeholder.png'" alt="owner image avatar" /> </v-avatar>
            <span v-if="!$isMobile" class="pe-2">{{ $user.firstName + ' ' + $user.lastName }}</span>
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

      <template v-slot:extension>
        <v-tabs class="main-tabs" background-color="transparent" icons-and-text :value="toolbars.findIndex(t => t.path === $route.path)">

          <v-tabs-slider color="white" />

          <v-tab v-for="(toolbarItem, index) in toolbars" :key="index" :class="{'ms-0': index === 0}" @click="$router.push(toolbarItem.path, () => {})">
            {{ toolbarItem.title }}
            <v-icon v-if="!$isMobile && toolbarItem.icon" class="mb-0">{{ toolbarItem.icon }}</v-icon>
          </v-tab>

        </v-tabs>
      </template>

    </v-app-bar>

    <div class="main-view">

      <router-view class="main-content" :class="{'mobile': $isMobile}" />

      <div v-if="$isMobile" class="bottom-spacer">
        تهیه شده توسط یونس خوش قدم
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'MainBase',
  data: () => ({
    toolbars: [
      { path: '/users/list', title: 'لیست کاربران', icon: 'mdi-account-group' },
      { path: '/handouts/list', title: 'لیست جزوه‌ها', icon: 'mdi-file' },
      { path: '/categorys/list', title: 'لیست دسته بندی‌ها', icon: 'mdi-tag' },
      { path: '/tags/list', title: 'لیست تگ‌ها', icon: 'mdi-pound' }
    ]
  }),
  beforeMount() {
    if (!this.$token) {
      this.$router.replace('/auth');
    }
    else if (this.$route.name === 'MainBase') {
      this.$router.replace(this.toolbars[0].path);
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-base {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    .main-bar {
      flex-grow: 0;
      z-index: 10;
      &.has-tabs-icons {
        height: 128px !important;
        ::v-deep .v-toolbar__content {
          height: 64px !important;
        }
        ::v-deep .v-toolbar__extension {
          height: 64px !important;
        }
      }
    }
    .main-view {
      background-color: #EFEFEF;
      flex-grow: 1;
      .main-content {
        max-width: 850px;
        &.mobile {
          min-height: 100%;
          min-height: calc(100% - 56px);
        }
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
