<template>
  <v-container fluid class="page">
    <y-resource-tree-viewer
      :title="$route.meta.title"
      :icon="$route.meta.icon"
      :model="$route.meta.model"
      :parental-key="$route.meta.parentalKey"
      :avatar-key="$route.meta.avatarKey"
      :custom-adds="$route.meta.customAdds"
    />
  </v-container>
</template>

<script>

import YResourceTreeViewer from '../../components/y-resource-manager/y-resource-tree-viewer.vue';

export default {
  name: 'ResourceTreeViewer',
  components: {
    'y-resource-tree-viewer': YResourceTreeViewer
  }
};

</script>
