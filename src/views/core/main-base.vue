<template>
  <div class="main-base" style="position: relative;">

    <v-app-bar absolute color="primary" dark>

      <v-toolbar-title>اپلیکیشن من</v-toolbar-title>

      <v-btn class="ms-4" text @click="$router.replace('/home', () => {})">
        خانه
      </v-btn>

      <v-spacer />

      <v-btn icon v-if="!$token">
        <v-icon>mdi-login</v-icon>
      </v-btn>
      
      <v-menu v-else offset-y>

        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-avatar size="24" class="mt-1 me-1"> <img :src="$user.profile.path || 'http://www.lakeportmetalcraft.com/wp-content/uploads/2018/10/user-placeholder.png'" alt="owner image avatar" /> </v-avatar>
            {{ $user.firstName + ' ' + $user.lastName }}
          </v-btn>
        </template>

        <v-list dense>

          <v-list-item @click="$router.push(`/user/${$user._id}`)">
            <v-list-item-title>مشاهده پروفایل</v-list-item-title>
          </v-list-item>
          
          <!-- <v-divider /> -->

          <v-list-item @click="$root.logout() && $router.replace('/auth')">
            <v-list-item-title>خروج از حساب کاربری</v-list-item-title>
          </v-list-item>

        </v-list>

      </v-menu>

    </v-app-bar>

    <router-view class="main-content" />

  </div>
</template>

<script>
export default {
  name: 'MainBase',
  beforeMount() {
    if (!this.$token) {
      this.$router.replace('/auth');
    }
    else if (this.$route.name === 'MainBase') {
      this.$router.replace('/home');
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-base {
    height: 100%;
    .main-content {
      overflow-y: auto;
      height: 100%;
      padding-top: 64px; // TODO: reat to app bar size change
    }
  }
</style>
