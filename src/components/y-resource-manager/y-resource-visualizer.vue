<template>
  <v-menu open-on-hover offset-y offset-x fixed :disabled="model !== 'Media' || !resource.path">

    <template #activator="{ on }">
      <span :title="model === 'Media' || error ? title : undefined" class="y-resource-visualizer d-inline-block primary--text caption text-decoration-underline" style="cursor: pointer" v-on="on" @click="!error && goToResource()">
        <v-icon v-if="error" small color="red">
          mdi-alert-circle-outline
        </v-icon>
        <template v-else>
          {{ model === 'Media' ? 'Media File' : title }}
        </template>
      </span>
    </template>

    <v-card v-if="model === 'Media' && resource.path" flat>
      <v-img :src="resource.path" width="169" height="auto" />
    </v-card>

  </v-menu>
</template>

<script>

import { YNetwork } from 'ynetwork';
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
  computed: {
    isResourceImage() {
      return this.model === 'Media' && this.resource.type && ['image/bmp', 'image/jpeg', 'image/png', 'image/tiff'].includes(this.resource.type);
    }
  },
  async mounted() {

    const result = await Promise.all([
      transformResourceToTitle(this.$apiBase, this.model, this.id),
      YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.model)}/${this.id}`)
    ]);

    if (result[0] === '---' || result[1].status !== 200) {
      this.error = true;
      if (result[1].status !== 200) this.title = result[1].data;
      return;
    }

    this.title = result[0];
    this.resource = result[1].data;

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