<template>
  <v-sheet elevation="8" width="256" class="ma-0">
    <v-list nav dense height="100%" class="pb-0" :color="color || 'primary'" dark>

      <v-list-item class="text-center list-item-flat mx-n2 mt-n2" :style="{ 'height': `${appbarHeight}px`, 'background': $vuetify.theme.themes.light.primary }" @click="$router.push((toolbarItems[0] || { path: '/' }).path, () => {})">
        <v-list-item-title class="flex-row d-flex align-center justify-center font-weight-light ms-n4" style="font-size: 1.4em;">
          <v-img src="../../../assets/img/logo.png" width="32" class="flex-grow-0 me-3" />
          {{ $options.Title }}
        </v-list-item-title>
      </v-list-item>

      <div v-if="$token" class="mx-n2 mt-n1">
        <v-expansion-panels flat accordion tile hover>
          <v-expansion-panel style="background: transparent;">

            <v-expansion-panel-header class="px-2 py-4" hide-actions>
              <v-avatar size="36" class="flex-grow-0 me-3">
                <v-img :src="($user.profilePicture && $user.profilePicture.path) || $options.UserPlaceholder" />
              </v-avatar>
              <div class="text-body-2 flex-grow-1">{{ $user.name }}</div>
            </v-expansion-panel-header>

            <v-expansion-panel-content class="sidebar-panel-content">

              <v-list-item :to="`/users/${$user._id}`">
                <v-list-item-icon class="ms-1 me-1">
                  <v-icon small>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-light">مشاهده پروفایل</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-list-item :style="{ 'background': $vuetify.theme.themes.light.error }" @click="$root.logout(); $router.replace('/auth')">
                <v-list-item-icon class="ms-1 me-1">
                  <v-icon small>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title class="font-weight-light">خروج از حساب کاربری</v-list-item-title>
                </v-list-item-content>
              </v-list-item>

            </v-expansion-panel-content>

          </v-expansion-panel>
        </v-expansion-panels>
      </div>
      <v-list-item v-else class="list-item-flat mx-n2 mt-n1 py-2" to="/auth">
        <v-list-item-icon class="me-4">
          <v-icon>mdi-login</v-icon>
        </v-list-item-icon>
        <v-list-item-title class="text-body-1 font-weight-light">ورود به حساب کاربری</v-list-item-title>
      </v-list-item>

      <div class="items-part no-scrollbar">

        <template v-if="!expandingItems">
          <v-list-item-group v-for="(items, groupName) in toolbarGroups" :key="groupName" class="pt-3">
            <v-subheader class="mb-1" style="height: 24px;">{{ groupName }}</v-subheader>
            <v-list-item v-for="item in items" class="list-item-flat" :key="item.title" :to="item.path">
              <v-list-item-icon class="ms-1 me-2">
                <v-icon small>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="font-weight-light">{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </template>

        <template v-if="expandingItems">
          <v-expansion-panels multiple flat accordion tile hover :value="activeRouteGroup">
            <v-expansion-panel v-for="(items, groupName) in toolbarGroups" :key="groupName" style="background: transparent;">
              
              <v-expansion-panel-header class="px-5 py-3" style="font-size: 0.85em; min-height: unset;">
                {{ groupName }}
              </v-expansion-panel-header>

              <v-expansion-panel-content class="sidebar-panel-content">
                <v-list-item v-for="item in items" :key="item.title" :to="item.path">
                  <v-list-item-icon class="ms-1 me-1">
                    <v-icon small>{{ item.icon }}</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title class="font-weight-light">{{ item.title }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-expansion-panel-content>

            </v-expansion-panel>
          </v-expansion-panels>
        </template>

      </div>

      <v-list-item class="text-center" style="min-height: 24px;">
        <v-list-item-title class="font-weight-light caption">
          نسخه {{ $options.Version }}
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-sheet>
</template>

<script>

import UserPlaceholder from '../../../assets/img/user-placeholder.jpeg';
import { version as Version, title as Title } from '../../../../package.json';
import groupBy from 'lodash/groupBy';

export default {
  name: 'MainSidebar',
  UserPlaceholder,
  Version,
  Title,
  props: {
    toolbarItems: Array,
    expandingItems: Boolean,
    color: String,
    appbarHeight: Number
  },
  computed: {
    toolbarGroups() {
      return groupBy(this.toolbarItems, 'group');
    },
    activeRouteGroup() {
      
      const targetRoute = this.$route.matched.slice(-1)[0];
      
      for (const groupName in this.toolbarGroups) {
        for (const item of this.toolbarGroups[groupName]) {
          if (item.path === targetRoute.path) {
            return [Object.keys(this.toolbarGroups).indexOf(groupName)];
          }
        }
      } return [];

    }
  },
  mounted() {
    document.querySelectorAll('html, body, .v-application').forEach(element => element.style.height = '100%');
  },
  beforeDestroy() {
    document.querySelectorAll('html, body, .v-application').forEach(element => element.style.height = 'unset');
  }
};

</script>

<style lang="scss" scoped>

  .v-sheet {
    border-radius: 0;
    & > .v-list {
      border-radius: 0;
      display: flex;
      flex-direction: column;
      & > * {
        flex: unset;
      }
      & > .items-part {
        height: 0;
        flex-grow: 1;
        overflow-y: auto;
        margin: 8px -8px;
        & > .v-item-group:not(:first-child) {
          margin-top: 12px;
        }
      }
    }
  }

  ::v-deep {
    .sidebar-panel-content > .v-expansion-panel-content__wrap {
      padding: 8px 8px;
    }
  }

  ::v-deep {
    .list-item-flat {
      border-radius: 0 !important;
      &::before {
        border-radius: 0 !important;
      }
    }
  }

</style>
