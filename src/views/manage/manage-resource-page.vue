<template>
  <v-container fluid class="page">
    <y-resource-manager
      :title="$route.meta.title"
      :icon="$route.meta.icon"
      :model-name="$route.meta.model"
      sort-latest
      :custom-actions="$route.meta.customActions"
      :new-url="$route.meta.newUrl"
      :edit-handler="$route.meta.editHandler ? (it => $route.meta.editHandler(this, it)) : undefined"
      :editor-width="$route.meta.editorWidth"
    />
  </v-container>
</template>

<script>

import YResourceManager from '../../components/y-resource-manager/y-resource-manager.vue';

export default {
  name: 'ListResourcePage',
  components: {
    'y-resource-manager': YResourceManager
  }
};

</script>
