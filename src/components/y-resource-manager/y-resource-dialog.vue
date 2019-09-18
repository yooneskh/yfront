<template>
  <v-card :loading="metas.list.length === 0">

    <v-card-title> 
      افزودن مورد جدید
    </v-card-title>

    <v-card-text class="pb-0">
      <y-form
        :target="resource"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn text color="primary" @click="submit">افزودن</v-btn>
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
    this.loadMeta();
  },
  methods: {
    async loadMeta() {
      
      const { status, result } = await YNetwork.get(`${this.apiBase}/${this.modelName}/meta`);

      this.metas.list = result;
      
    },
    async submit() {
      if (this.resource._id) {

        const { status, result } = await YNetwork.put(`${this.apiBase}/${this.modelName}/${this.resource._id}`, this.resource);

        if (this.$generalHandle(status, result)) return;

        this.$toast('تغییر انجام شد.')

      }
      else {
        
        const { status, result } = await YNetwork.post(`${this.apiBase}/${this.modelName}`, this.resource);

        if (this.$generalHandle(status, result)) return;

        this.$toast('ثبت انجام شد.')

      }

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