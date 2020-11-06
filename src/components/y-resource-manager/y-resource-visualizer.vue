<template>
  <v-btn text small :icon="error" color="primary" :title="model === 'Media' && title" class="y-resource-visualizer" @click="!error && goToResource()">
    <v-icon v-if="error" small :color="error ? 'red': undefined">
      mdi-alert-circle-outline
    </v-icon>
    <template v-else>
      {{ model === 'Media' ? 'Media File' : title }}
    </template>
  </v-btn>
</template>

<script>

import YNetwork from 'ynetwork';
import { pluralizeModelName, transformResourceToTitle } from './y-resource-util'

export default {
  name: 'YResourceVisualizer',
  props: {
    model: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  data: () => ({
    resource: {},
    error: false,
    title: ''
  }),
  async mounted() {

    const result = await Promise.all([
      transformResourceToTitle(this.$apiBase, this.model, this.id),
      YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.model)}/${this.id}`)
    ]);

    if (result[0] === '---' || result[1].status !== 200) {
      this.error = true;
      return;
    }

    this.title = result[0];
    this.resource = result[1].result;

  },
  methods: {
    goToResource() {
      if (this.model === 'Media') {
        window.open(this.resource.path, '_blank');
      }
      else {
        this.$dialog(import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
          width: '450px',
          modelName: this.model,
          baseResource: this.resource,
          readonly: true
        });
      }
    }
  }
}

</script>