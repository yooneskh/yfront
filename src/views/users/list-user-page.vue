<template>
  <v-container fluid class="page" style="max-width: 1200px;">
    <y-resource-manager
      class="my-4"
      title="مدیریت کاربران"
      api-base="https://api.hashkhand.yooneskh.ir/api/v1"
      model-name="User"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListUsersPage',
  components: {
    'y-resource-manager': () => import('../../components/y-resource-manager/y-resource-manager.vue' /* webpackChunkName: 'y-resource-manager' */)
  },
  data: () => ({

  })
};
</script>
