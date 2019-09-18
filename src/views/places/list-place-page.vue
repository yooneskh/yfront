<template>
  <v-container fluid class="page">
    <y-resource-manager
      class="mt-4"
      title="مدیریت پست‌ها"
      api-base="https://api.hashkhand.yooneskh.ir/api/v1"
      model-name="posts"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListPlacePage',
  components: {
    'y-resource-manager': () => import('../../components/y-resource-manager/y-resource-manager.vue' /* webpackChunkName: 'y-resource-manager' */)
  },
  data: () => ({

  })
};
</script>
