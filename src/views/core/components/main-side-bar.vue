<template>
  <v-sheet elevation="1" :width="collapsed ? 64 : 285" class="main-sidebar ma-0 grey lighten-5 d-flex flex-column">

    <div class="sidebar-header flex-grow-0">
      <v-card v-if="!collapsed" outlined :color="color" :dark="dark" class="d-flex flex-row align-center ma-2 pa-2 rounded-sm" :to="(validToolbarItems[0][0] || { path: '/' }).path">
        <v-img src="../../../assets/img/logo.png" width="40" class="flex-grow-0 me-4 ms-2" contain />
        <div class="titles">
          <div class="text-h6 font-weight-bold">
            {{ $options.Title }}
          </div>
          <div class="text-subtitle-2">
            مدیریت مرکزی
          </div>
        </div>
      </v-card>
      <div v-else class="pa-1">
        <v-btn
          depressed
          color="primary"
          class="flex-grow-0"
          width="56" height="56"
          style="min-width: 0;"
          :to="(validToolbarItems[0][0] || { path: '/' }).path">
          <v-img src="../../../assets/img/logo.png" width="40" class="flex-grow-0" contain />
        </v-btn>
      </div>
    </div>

    <div class="sidebar-items d-flex flex-row flex-grow-1" style="border-top: 1px solid rgba(0, 0, 0, 0.15);">

      <div class="sidebar-items-groups d-flex flex-column px-2 pt-2" style="height: 100%;" :style="`border-${collapsed ? 'none' : ($vuetify.rtl ? 'left' : 'right')}: 1px solid rgba(0, 0, 0, 0.15);`">

        <v-menu>
          <template #activator="{ on }">
            <v-tooltip fixed :left="$vuetify.rtl" :right="!$vuetify.rtl">
              <template #activator="{ on: tooltipOn }">
                <v-btn text class="flex-grow-0 px-0 mb-1" width="48" height="48" v-on="{ ...on, ...tooltipOn }" style="min-width: 0;">
                  <v-avatar size="36">
                    <v-img :src="($user.profile && $user.profile.path) || $options.UserPlaceholder" />
                  </v-avatar>
                </v-btn>
              </template>
              <span>{{ $user.name }}</span>
            </v-tooltip>
          </template>
          <v-card dark flat min-width="285">
            <v-list dense nav>
              <v-list-item @click.stop>
                <v-list-item-icon class="me-3">
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>مشاهده پروفایل</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item class="red mt-2" @click="$root.logout()">
                <v-list-item-icon class="me-3">
                  <v-icon color="white">mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-content class="white--text">
                  <v-list-item-title>خروج از حساب کاربری</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>

        <v-tooltip v-for="group of validToolbarItems" :key="group.groupTitle" fixed :left="$vuetify.rtl" :right="!$vuetify.rtl">
          <template #activator="{ on }">
            <v-btn
              text
              class="flex-grow-0 px-0 mb-1"
              :class="{'active-tint': activeGroup && group.groupTitle === activeGroup.groupTitle }"
              width="48" height="48"
              v-on="on"
              @click="selectedGroup = group; collapsed = false;"
              style="min-width: 0;">
              <v-icon style="color: rgba(0, 0, 0, 0.5;">
                {{ group.groupIcon }}
              </v-icon>
            </v-btn>
          </template>
          <span>{{ group.groupTitle }}</span>
        </v-tooltip>

        <v-spacer />

        <v-btn
          text
          class="flex-grow-0 px-0 mb-1"
          width="48" height="48"
          @click="collapsed = !collapsed;"
          style="min-width: 0;">
          <v-icon style="color: rgba(0, 0, 0, 0.5;">
            {{ collapsed ? `mdi-chevron-${$vuetify.rtl ? 'left' : 'right'}` : `mdi-chevron-${$vuetify.rtl ? 'right' : 'left'}` }}
          </v-icon>
        </v-btn>

        <div class="caption align-self-center my-1 grey--text">
          {{ $options.Version }}
        </div>

      </div>

      <div v-if="!collapsed" class="d-flex flex-column sidebar-items-children grey lighten-4 pa-2 flex-grow-1">

        <v-list dense nav class="pa-0" style="background: transparent;">
          <v-list-item v-for="child of (selectedGroup || activeGroup || {}).children" :key="child.path + child.title" :to="child.path && !child.path.startsWith('http') ? child.path : undefined" :href="child.path && child.path.startsWith('http') ? child.path : undefined" :target="child.path && child.path.startsWith('http') ? '_blank' : undefined" v-on="makeEventHandlersFor(child)">
            <v-list-item-icon v-if="child.icon" class="me-2">
              <v-icon small>{{ child.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-spacer />

        <v-list v-if="extraToolbarItems && extraToolbarItems.length > 0" dense nav class="pa-0" style="background: transparent;">
          <v-list-item v-for="child of extraToolbarItems" :key="child.path + child.title" :to="child.path && !child.path.startsWith('http') ? child.path : undefined" :href="child.path && child.path.startsWith('http') ? child.path : undefined" :target="child.path && child.path.startsWith('http') ? '_blank' : undefined" v-on="makeEventHandlersFor(child)">
            <v-list-item-icon v-if="child.icon" class="me-2">
              <v-icon small>{{ child.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ child.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>

      </div>

    </div>

  </v-sheet>
</template>

<script>

import UserPlaceholder from '../../../assets/img/user-placeholder.jpeg';
import { version as Version, title as Title } from '../../../../package.json';

export default {
  name: 'MainSidebar',
  UserPlaceholder,
  Version,
  Title,
  props: {
    toolbarItems: Array,
    extraToolbarItems: Array,
    color: String,
    dark: Boolean
  },
  data: () => ({
    selectedGroup: undefined,
    collapsed: false
  }),
  watch: {
    '$route'() {
      this.selectedGroup = undefined;
    }
  },
  computed: {
    validToolbarItems() {
      return this.toolbarItems.filter(it => it.children?.length > 0);
    },
    activeGroup() {

      const targetRoute = this.$route.matched.slice(-1)[0];

      for (const group of this.validToolbarItems) {
        for (const child of group.children) {
          if (child.path === targetRoute.path) {
            return group;
          }
        }
      }

      return undefined;

    }
  },
  mounted() {
    document.querySelectorAll('html, body, .v-application').forEach(element => element.style.height = '100%');
  },
  beforeDestroy() {
    document.querySelectorAll('html, body, .v-application').forEach(element => element.style.height = 'unset');
  },
  methods: {
    makeEventHandlersFor(item) {
      if (item.handler) {
        return {
          click: item.handler
        }
      } return {};
    }
  }
};

</script>

<style lang="scss" scoped>
  .v-sheet {
    border-radius: 0;
  }
  .active-tint {
    background: rgba(0, 0, 0, 0.069);
  }
</style>
