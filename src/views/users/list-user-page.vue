<template>
  <v-container fluid class="page" style="max-width: 1200px;">
    <y-resource-manager
      title="مدیریت کاربران"
      model-name="User"
    />
    <y-resource-manager
      title="Books"
      model-name="Book"
      class="mt-2"
    />
    <y-resource-manager
      title="Pages"
      model-name="Page"
      class="mt-2"
    />
    <y-resource-manager
      title="Authors"
      model-name="Author"
      class="mt-2"
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
