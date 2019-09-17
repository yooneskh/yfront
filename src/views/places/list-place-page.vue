<template>
  <v-container fluid class="page pa-0">
    <y-resource-manager
      class="mt-4"
      title="مدیریت پست‌ها"
      api-base="https://api.hashkhand.yooneskh.ir/api/v1/posts"
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
