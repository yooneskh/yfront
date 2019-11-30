<template>
  <v-sheet elevation="8" width="250" class="ma-0">
    <v-list nav dense height="100%" color="primary" dark>

      <v-list-item class="text-center py-4" @click="$router.push('/', () => {})">
        <v-list-item-title style="font-size: 1.5em; line-height: unset;">
          اپلیکیشن من
        </v-list-item-title>
      </v-list-item>

      <div class="items-part">
        <v-list-item-group v-for="(items, groupName) in toolbarGroups" :key="groupName">
          <v-subheader class="mb-1" style="height: 24px;">{{ groupName }}</v-subheader>
          <v-list-item v-for="item in items" :key="item.title" :to="item.path">
            <v-list-item-icon class="me-2">
              <v-icon small>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </div>

      <v-list-item v-if="!$token" @click.stop>
        <v-list-item-icon class="me-2">
          <v-icon small>mdi-login</v-icon>
        </v-list-item-icon>
        <v-list-item-title>ورود</v-list-item-title>
      </v-list-item>
      <v-menu v-else absolute min-width="200">

        <template #activator="{ on }">
          <v-list-item v-on="on">
            <v-list-item-avatar size="24" class="me-4 my-0">
              <v-avatar size="24">
                <v-img :src="($user.profile && $user.profile.path) || $options.UserPlaceholder" />
              </v-avatar>
            </v-list-item-avatar>
            <v-list-item-title>{{ $user.firstName + ' ' + $user.lastName }}</v-list-item-title>
          </v-list-item>
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

      <v-list-item class="text-center" style="min-height: 24px;">
        <v-list-item-title style="font-size: 0.69em;">
          نسخه {{ $options.Version }}
        </v-list-item-title>
      </v-list-item>

    </v-list>
  </v-sheet>
</template>

<script>

import UserPlaceholder from '../../../assets/img/user-placeholder.jpeg';
import { version as Version } from '../../../../package.json';
import { groupBy } from 'lodash';

export default {
  name: 'MainSidebar',
  UserPlaceholder,
  Version,
  props: {
    toolbarItems: Array
  },
  computed: {
    toolbarGroups() {
      return groupBy(this.toolbarItems, 'group');
    }
  }
}
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
        margin: 16px -8px;
        & > .v-item-group:not(:first-child) {
          margin-top: 12px;
        }
      }
    }
  }
</style>

<style>
  html, body, .v-application {
    height: 100%;
  }
</style>