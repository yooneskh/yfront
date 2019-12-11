<template>
  <v-container fluid class="page" style="max-width: 1200px;">
    <y-resource-manager
      title="مدیریت نویسندگان"
      model-name="Author"
    />
    <y-resource-manager
      class="mt-2"
      title="مدیریت کاربران"
      model-name="User"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListUsersPage',
  components: {
    'y-resource-manager': () => import('../../components/y-resource-manager/y-resource-manager.vue' /* webpackChunkName: 'y-resource-manager' */)
  }
};
</script>
