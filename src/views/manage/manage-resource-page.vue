<template>
  <v-container fluid class="page">
    <y-resource-manager
      :title="$route.meta.title"
      :icon="$route.meta.icon"
      :model-name="$route.meta.model"
      sort-latest
      :new-url="$route.meta.newUrl"
      :edit-handler="$route.meta.editHandler ? (it => $route.meta.editHandler(this, it)) : undefined"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ListResourcePage',
  components: {
    'y-resource-manager': require('../../components/y-resource-manager/y-resource-manager.vue').default
  }
};
</script>
