<template>
  <div class="main-base">

    <v-app-bar class="main-bar" :class="{'has-tabs-icons': !$isMobile && $data.toolbars && toolbars.length > 0}" color="primary" dark>

      <v-toolbar-title>اپلیکیشن من</v-toolbar-title>

      <v-btn class="ms-4" text to="/">
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
            <span v-if="!$isMobile" class="pe-2">{{ $user.firstName + ' ' + $user.lastName }}</span>
          </v-btn>
        </template>

        <v-card width="200">
          <v-list class="text-center" dense nav>

            <v-list-item :to="`/users/${$user._id}`">
              <v-list-item-title>مشاهده پروفایل</v-list-item-title>
            </v-list-item>
            
            <!-- <v-divider /> -->

            <v-list-item class="mt-4" @click="$root.logout(); $router.replace('/auth')">
              <v-list-item-title class="red--text">خروج از حساب کاربری</v-list-item-title>
            </v-list-item>

          </v-list>
        </v-card>

      </v-menu>

      <!-- <template v-slot:extension>
        <v-tabs class="main-tabs" background-color="transparent" icons-and-text :value="toolbars.findIndex(t => t.path === $route.path)">

          <v-tabs-slider color="white" />

          <v-tab v-for="(toolbarItem, index) in toolbars" :key="index" :class="{'ms-0': index === 0}" @click="$router.push(toolbarItem.path, () => {})">
            {{ toolbarItem.title }}
            <v-icon v-if="!$isMobile && toolbarItem.icon" class="mb-0">{{ toolbarItem.icon }}</v-icon>
          </v-tab>

        </v-tabs>
      </template> -->

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
  components: {

  },
  data: () => ({
    // toolbars: [
    //   { path: '/users/list', title: 'لیست کاربران', icon: 'mdi-account-group' }
    // ]
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
