<template>
  <div class="main-base" style="position: relative;">
      <v-app-bar absolute color="primary" dark ref="appBar">
        <v-toolbar-title>My Application</v-toolbar-title>
        <v-spacer />
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
      <router-view ref="contentView" class="main-content" />
  </div>
</template>

<script>
export default {
  name: 'MainBase',
  mounted() {

    // setTimeout(() => {
    // this.$refs.contentView.$el.style.paddingTop = this.$refs.appBar.$el.offsetHeight + 'px';
      // this.$refs.contentView.$el.style.paddingTop = 64 + 'px';
    // }, 0);

    if (this.$route.name === 'MainBase') {
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
