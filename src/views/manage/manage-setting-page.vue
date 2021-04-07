<template>
  <v-container fluid class="page">
    <y-setting-resource-manager
      :icon="$route.meta.icon"
      :title="$route.meta.title"
      :model="$route.meta.model"
      :path-suffix="$route.meta.pathSuffix"
    />
  </v-container>
</template>

<script>
export default {
  name: 'ManageSettingResourcePage',
  components: {
    'y-setting-resource-manager': require('../../components/y-resource-manager/y-setting-resource-manager.vue').default
  }
};
</script>
