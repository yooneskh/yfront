<template>
  <v-btn text small :icon="error" class="y-resource-visualizer" @click="!error && goToResource()">
    <v-icon v-if="error" small :color="error ? 'red': undefined">
      mdi-alert-circle-outline
    </v-icon>
    <template v-else>
      {{ title }}
    </template>
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
    resource: {},
    error: false
  }),
  computed: {
    title() {
      return this.metas.filter(meta => meta.titleAble).map(meta => this.resource[meta.key]).join(' ');
    }
  },
  async mounted() {

    const modelUrl = this.model.toLowerCase() + 's';

    const result = await Promise.all([
      YNetwork.get(`${this.$apiBase}/${modelUrl}/metas`),
      YNetwork.get(`${this.$apiBase}/${modelUrl}/${this.id}`)
    ]);

    if (result[0].status !== 200 || result[1].status !== 200) {
      this.error = true;
      return;
    }

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