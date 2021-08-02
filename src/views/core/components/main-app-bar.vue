<template>
  <div class="main-bar app-bar" :class="{'sticky': sticky}">
    <v-toolbar elevation="0">

      <v-toolbar-title class="d-flex flex-row d-flex align-center me-3" @click="$router.push((joinedToolbarItems[0] || { path: '/' }).path, () => {})" style="cursor: pointer;">
        <img class="me-2" src="../../../assets/img/logo.png" style="height: 36px;" />
        <span class="primary--text">{{ $options.Title }}</span>
      </v-toolbar-title>

      <template v-if="!$isMobile">
        <v-btn
          v-for="item in barStartItems" :key="item.title + item.path"
          text class="ms-1"
          :to="item.path && !item.path.startsWith('http') ? item.path : undefined"
          :href="item.path && item.path.startsWith('http') ? item.path : undefined"
          :target="item.path && item.path.startsWith('http') ? '_blank' : undefined"
          v-on="makeEventHandlersFor(item)">
          <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </template>

      <v-spacer />

      <template v-if="!$isMobile">
        <v-btn
          v-for="item in barEndItems" :key="item.title + item.path"
          text class="me-1"
          :to="item.path && !item.path.startsWith('http') ? item.path : undefined"
          :href="item.path && item.path.startsWith('http') ? item.path : undefined"
          :target="item.path && item.path.startsWith('http') ? '_blank' : undefined"
          v-on="makeEventHandlersFor(item)">
          <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </template>

      <v-btn v-if="!$isMobile && !$token" rounded outlined color="primary" class="ms-3" :to="`/auth?next=${$route.path}`">
        ورود
        <v-icon right>mdi-login</v-icon>
      </v-btn>
      <v-menu v-else dark min-width="225" nudge-bottom="8" offset-y bottom>

        <template v-slot:activator="{ on }">
          <v-btn rounded color="primary" outlined class="px-5" v-on="$isMobile ? { click: toggleMenu } : on">
            <v-avatar v-if="$token" size="24" class="me-2"> <img :src="$user.profile && $user.profile.path || $userPlaceholder" alt="owner image avatar" /> </v-avatar>
            <span class="mt-n1">{{ $isMobile ? 'منو' : $user.name }}</span>
          </v-btn>
        </template>

        <v-list dense nav>

          <v-list-item to="/profile">
            <v-list-item-icon class="me-2">
              <v-icon small>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>مشاهده پروفایل</v-list-item-title>
          </v-list-item>

          <v-list-item @click="$root.logout()">
            <v-list-item-icon class="me-2">
              <v-icon small color="error">mdi-delete</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="red--text">خروج از حساب کاربری</v-list-item-title>
          </v-list-item>

        </v-list>

      </v-menu>

    </v-toolbar>

    <div v-if="joinedToolbarItems && joinedToolbarItems.length > 0" class="d-flex" style="background: white; white-space: nowrap; overflow-x: auto;">

      <template v-if="!$isMobile">
        <v-btn
          v-for="item in toolbarStartItems" :key="item.title + item.path"
          text class="rounded-0" large
          :to="item.path && !item.path.startsWith('http') ? item.path : undefined"
          :href="item.path && item.path.startsWith('http') ? item.path : undefined"
          :target="item.path && item.path.startsWith('http') ? '_blank' : undefined"
          v-on="makeEventHandlersFor(item)">
          <v-icon v-if="item.icon" left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </template>

      <v-spacer />

      <template v-if="!$isMobile">
        <v-btn
          v-for="item in toolbarEndItems" :key="item.title + item.path"
          text class="rounded-0" large
          :to="item.path && !item.path.startsWith('http') ? item.path : undefined"
          :href="item.path && item.path.startsWith('http') ? item.path : undefined"
          :target="item.path && item.path.startsWith('http') ? '_blank' : undefined"
          v-on="makeEventHandlersFor(item)">
          <v-icon v-if="item.icon" class="me-2">{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </template>

    </div>

  </div>
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
    toolbarItems: Array,
    extraToolbarItems: Array
  },
  computed: {
    barStartItems() {
      return [
        ...this.joinedToolbarItems.filter(it => it.bar === 'topStart')
      ];
    },
    barEndItems() {
      return [
        ...this.joinedToolbarItems.filter(it => it.bar === 'topEnd')
      ];
    },
    toolbarStartItems() {
      return [
        ...this.joinedToolbarItems.filter(it => !it.bar || it.bar === 'bottomStart')
      ];
    },
    toolbarEndItems() {
      return [
        ...this.joinedToolbarItems.filter(it => it.bar === 'bottomEnd')
      ];
    },
    joinedToolbarItems() {
      return [
        ...this.toolbarItems.flatMap(it =>
          it.children.map(child => ({
            ...it,
            children: undefined,
            ...child
          }))
        ),
        ...this.extraToolbarItems
      ];
    }
  },
  methods: {
    makeEventHandlersFor(item) {
      if (item.handler) {
        return {
          click: item.handler
        }
      } return {};
    },
    async toggleMenu() {

      const listItems = [];

      if (this.$token) {
        listItems.push({
          value: 'profile',
          icon: 'mdi-account',
          text: 'مشاهده پروفایل',
          color: 'primary'
        });
      }
      else {
        listItems.push({
          value: 'login',
          icon: 'mdi-login',
          text: 'ورود',
          color: 'white',
          itemClass: 'primary'
        });
      }

      listItems.push(...this.joinedToolbarItems.map((it, index) => ({
        value: index,
        icon: it.icon,
        text: it.title
      })));

      if (this.$token) {
        listItems.push({
          value: 'logout',
          icon: 'mdi-logout',
          text: 'خروج از حساب کاربری',
          color: 'white',
          itemClass: 'error'
        });
      }

      const item = await this.$dialogListPicker({
        icon: 'mdi-menu',
        title: this.$user.name || 'منو',
        body: 'به کجا می‌خواهید بروید؟',
        items: listItems,
        navigation: true
      }); if (!item) return;

      if (item === 'login') {
        this.$router.push(`/auth?next=${this.$route.path}`);
      }
      else if (item === 'profile') {
        this.$router.push('/profile');
      }
      else if (item === 'logout') {
        this.$root.logout();
      }
      else {

        const target = this.joinedToolbarItems[item];

        if (target.handler) {
          target.handler();
        }
        else {
          this.$router.push(target.path);
        }

      }

    }
  }
};

</script>

<style lang="scss" scoped>
  .app-bar {
    z-index: 10;
    border-bottom: 1px solid rgba(0, 0, 0, 0.069);
    &.sticky {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      box-shadow: 0 1px 2px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.07), 0 4px 8px rgba(0,0,0,0.07);
    }
  }
</style>