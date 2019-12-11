<template>
  <v-btn text small class="y-resource-visualizer" @click="goToResource">
    {{ title }}
  </v-btn>
</template>

<script>

import YNetwork from 'ynetwork';

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
    metas: [],
    resource: {}
  }),
  computed: {
    title() {
      return this.metas.filter(meta => meta.titleAble).map(meta => this.resource[meta.key]).join(' ');
    }
  },
  async mounted() {

    const modelUrl = this.model.toLowerCase() + 's';

    const result = await Promise.all([
      YNetwork.head(`${this.$apiBase}/${modelUrl}`),
      YNetwork.get(`${this.$apiBase}/${modelUrl}/${this.id}`)
    ]);

    this.metas = result[0].result;
    this.resource = result[1].result;

  },
  methods: {
    goToResource() {
      if (this.model === 'Media') {
        window.open(this.resource.path, '_blank');
      }
      else {
        this.$dialog(() => import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
          width: '400px',
          modelName: this.model,
          baseResource: this.resource,
          readonly: true
        });
      }
    }
  }
}

</script>

<style>

</style>