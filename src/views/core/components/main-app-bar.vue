<template>
  <v-app-bar :class="{'has-tabs': toolbarItems && toolbarItems.length > 0}" :color="color || 'primary'" :height="height" :elevate-on-scroll="sticky" :fixed="sticky" :dark="dark">

    <v-toolbar-title class="me-4" @click="$router.push(toolbarItems[0].path, () => {})" style="cursor: pointer;">
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
          <v-avatar size="24" class="mt-1 me-2 ms-2"> <img :src="($user.profilePicture && $user.profilePicture.path) || 'http://www.lakeportmetalcraft.com/wp-content/uploads/2018/10/user-placeholder.png'" alt="owner image avatar" /> </v-avatar>
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

    <template v-if="toolbarItems && toolbarItems.length > 0" #extension>
      <v-tabs background-color="transparent" icons-and-text>
        <v-tab v-for="item in toolbarItems" :key="item.title + item.path" :to="item.path">
          {{ item.title }}
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </template>

  </v-app-bar>
</template>

<script>
export default {
  name: 'MainAppBar',
  props: {
    color: String,
    sticky: Boolean,
    dark: Boolean,
    height: { type: Number, default: 64 },
    toolbarItems: Array
  }
}
</script>

<style lang="scss" scoped>
  .v-app-bar {
    z-index: 10;
    &.has-tabs {
      height: 128px !important;
      ::v-deep .v-toolbar__extension {
        height: 64px !important;
      }
    }
  }
</style>