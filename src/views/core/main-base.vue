<template>
  <div class="main-base">

    <v-app-bar color="primary" fixed elevate-on-scroll class="main-bar">

      <v-toolbar-title class="me-4" @click="$router.push('/', () => {})" style="cursor: pointer;">
        اپلیکیشن من
      </v-toolbar-title>

      <v-btn text to="/">
        خانه
      </v-btn>

      <v-spacer />

      <v-btn icon v-if="!$token" to="/auth">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      
      <v-menu v-else>

        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" class="px-0" style="min-width: unset;">
            <v-avatar size="24" class="mt-1 me-2 ms-2"> <img :src="($user.profile && $user.profile.path) || 'http://www.lakeportmetalcraft.com/wp-content/uploads/2018/10/user-placeholder.png'" alt="owner image avatar" /> </v-avatar>
            <span v-if="!$isMobile" class="pe-2 pt-1">{{ $user.firstName + ' ' + $user.lastName }}</span>
          </v-btn>
        </template>

        <v-list class="text-center" dense nav>

          <v-list-item :to="`/users/${$user._id}`">
            <v-list-item-title>مشاهده پروفایل</v-list-item-title>
          </v-list-item>
          
          <v-list-item class="mt-4" @click="$root.logout(); $router.replace('/auth')">
            <v-list-item-title class="red--text">خروج از حساب کاربری</v-list-item-title>
          </v-list-item>

        </v-list>

      </v-menu>

      <template v-slot:extension>
        <v-tabs class="main-tabs" background-color="transparent" :value="toolbars.findIndex(t => t.path === $route.path)">

          <v-tabs-slider color="white" />

          <v-tab v-for="(toolbarItem, index) in toolbars" :key="index" :class="{'ms-0': index === 0}" @click="$router.push(toolbarItem.path, () => {})">
            {{ toolbarItem.title }}
          </v-tab>

        </v-tabs>
      </template>

    </v-app-bar>

    <router-view class="main-content" :style="{'margin-top': (toolbars && toolbars.length > 0) ? '112px' : '64px' }" />

  </div>
</template>

<script>
export default {
  name: 'MainBase',
  data: () => ({
    toolbars: [
      { path: '/users/list', title: 'لیست کاربران' }
    ]
  }),
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
    .main-bar {
      z-index: 10;
      &:not(.v-app-bar--is-scrolled) {
        background: transparent !important;
        background-color: transparent !important;
      }
    }
  }
  
</style>
