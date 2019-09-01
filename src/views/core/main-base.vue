<template>
  <div class="main-base" style="position: relative;">

    <v-app-bar absolute color="primary" dark>

      <v-toolbar-title>اپلیکیشن من</v-toolbar-title>

      <v-spacer />

      <v-btn icon class="me-2">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>

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
      padding-top: 64px;
    }
  }
</style>
