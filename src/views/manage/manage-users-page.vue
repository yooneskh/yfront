<template>
  <v-container fluid class="page" style="max-width: 1200px;">
    <y-resource-manager
      title="مدیریت کاربران"
      icon="mdi-account"
      model-name="User"
      sort-latest
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListUsersPage',
  components: {
    'y-resource-manager': require('../../components/y-resource-manager/y-resource-manager.vue').default
  }
};
</script>
