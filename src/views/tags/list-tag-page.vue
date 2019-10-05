<template>
  <v-container fluid class="page" style="max-width: 1200px;">
    <y-resource-manager
      class="my-4"
      title="مدیریت تگ‌ها"
      :api-base="$apiBase"
      model-name="Tag"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListTagsPage',
  components: {
    'y-resource-manager': () => import('../../components/y-resource-manager/y-resource-manager.vue' /* webpackChunkName: 'y-resource-manager' */)
  }
};
</script>
