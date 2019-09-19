<template>
  <v-card :loading="metas.list.length === 0">

    <v-card-title> 
      {{ resource._id ? 'ویرایش' : 'افزودن' }} مورد
    </v-card-title>

    <v-card-text class="pb-0">
      <y-form
        :target="resource"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="submit">
        {{ resource._id ? 'ویرایش' : 'افزودن' }}
      </v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';

export default {
  name: 'YResourceDialog',
  props: {
    apiBase: {
      type: String,
      required: true
    },
    modelName: {
      type: String,
      required: true
    },
    baseResource: {
      type: Object
    }
  },
  data: () => ({
    resource: {},
    metas: {
      list: []
    }
  }),
  computed: {
    fields() {
      return this.metas.list.map(meta => ({
        key: meta.key,
        title: meta.title || meta.key,
        type: meta.ref ? 'resource' : this.mapMetaType(meta.type),
        resource: meta.ref,
        apiBase: this.apiBase
      }));
    }
  },
  mounted() {

    if (this.baseResource) Object.assign(this.resource, this.baseResource);

    this.loadMeta();

  },
  methods: {
    async loadMeta() {
      
      const { status, result } = await YNetwork.get(`${this.apiBase}/${this.modelName}/meta`);

      this.metas.list = result;
      
    },
    async submit() {

      const payload = { payload: { ...this.resource } };

      if (this.resource._id) {

        const { status, result } = await YNetwork.put(`${this.apiBase}/${this.modelName}/${this.resource._id}`, payload);

        if (this.$generalHandle(status, result)) return;

      }
      else {
        
        const { status, result } = await YNetwork.post(`${this.apiBase}/${this.modelName}`, payload);

        if (this.$generalHandle(status, result)) return;

      }

      this.$toast.success('درخواست شما انجام شد.')

    },
    mapMetaType(type) {
      switch (type) {
        case 'string': return 'text';
        case 'number': return 'text';
        case 'boolean': return 'checkbox';
        default: return 'text';
      }
    }
  }
}

</script>

<style>

</style>