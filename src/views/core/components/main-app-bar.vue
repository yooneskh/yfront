<template>
  <v-app-bar :class="{'has-tabs': joinedToolbarItems && joinedToolbarItems.length > 0}" :color="color || 'primary'" :height="height" :elevate-on-scroll="sticky" :fixed="sticky" :dark="dark">

    <v-toolbar-title class="flex-row d-flex align-center me-4" @click="$router.push((joinedToolbarItems[0] || { path: '/' }).path, () => {})" style="cursor: pointer;">
      <v-img height="36" width="36" class="me-2" src="../../../assets/img/logo.png" />
      {{ $options.Title }}
    </v-toolbar-title>

    <v-spacer />

    <v-btn icon v-if="!$token" :to="`/auth?next=${$route.path}`">
      <v-icon>mdi-login</v-icon>
    </v-btn>

    <v-menu dark min-width="225" nudge-bottom="8" offset-y bottom v-else>

      <template v-slot:activator="{ on }">
        <v-tooltip :disabled="!$isMobile" fixed :left="!$vuetify.rtl" :right="$vuetify.rtl">
          <template #activator="{ on: tooltipOn }">
            <v-btn text v-on="{ ...on, ...tooltipOn }" class="px-0" style="min-width: unset;">
              <v-avatar size="24" class="mt-1 me-2 ms-2"> <img :src="$user.profile && $user.profile.path || $userPlaceholder" alt="owner image avatar" /> </v-avatar>
              <span v-if="!$isMobile" class="pe-2 pt-1">{{ $user.name }}</span>
            </v-btn>
          </template>
          <span>{{ $user.name }}</span>
        </v-tooltip>
      </template>

      <v-list dense nav>

        <v-list-item :to="`/users/${$user._id}`">
          <v-list-item-icon class="me-2">
            <v-icon small>mdi-account</v-icon>
          </v-list-item-icon>
          <v-list-item-title>مشاهده پروفایل</v-list-item-title>
        </v-list-item>

        <v-list-item @click="$root.logout(); $router.replace('/auth')">
          <v-list-item-icon class="me-2">
            <v-icon small color="error">mdi-delete</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="red--text">خروج از حساب کاربری</v-list-item-title>
        </v-list-item>

      </v-list>

    </v-menu>

    <template v-if="joinedToolbarItems && joinedToolbarItems.length > 0" #extension>
      <v-tabs background-color="transparent" icons-and-text show-arrows>
        <v-tab
          v-for="item in joinedToolbarItems" :key="item.title + item.path"
          :to="!item.path.startsWith('http') ? item.path : undefined"
          :href="item.path.startsWith('http') ? item.path : undefined"
          :target="item.path.startsWith('http') ? '_blank' : undefined">
          {{ item.title }}
          <v-icon v-if="item.icon">{{ item.icon }}</v-icon>
        </v-tab>
      </v-tabs>
    </template>

  </v-app-bar>
</template>

<script>

import { title as Title } from '../../../../package.json';

export default {
  name: 'MainAppBar',
  Title,
  props: {
    color: String,
    sticky: Boolean,
    dark: Boolean,
    height: { type: Number, default: 64 },
    toolbarItems: Array
  },
  computed: {
    joinedToolbarItems() {
      return this.toolbarItems.flatMap(it =>
        it.children.map(child => ({
          ...it,
          children: undefined,
          ...child
        }))
      )
    }
  }
};

</script>

<style lang="scss" scoped>
  .v-app-bar {
    z-index: 10;
    &.has-tabs {
      height: 128px !important;
      ::v-deep .v-toolbar__extension {
        height: 64px !important;
        .v-tab {
          letter-spacing: 0;
        }
      }
    }
  }
</style>