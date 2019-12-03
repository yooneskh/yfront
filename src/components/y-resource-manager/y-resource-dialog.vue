<template>
  <v-card :loading="metas.list.length === 0 || loading">

    <v-card-title>
      {{ readonly ? ('مشاهده') : (resource._id ? 'ویرایش' : 'افزودن') }} مورد
    </v-card-title>

    <v-card-text class="pb-1">
      <y-form
        :target="resource"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions v-if="!readonly">
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
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
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
        type: this.mapMetaType(meta),
        wrapped: false, // for the file picker
        multiple: meta.isArray, // for select
        addable: meta.isArray, // for select again :D
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
      
      const { status, result } = await YNetwork.get(`${this.apiBase}/${this.modelName.toLowerCase() + 's'}/meta`);

      if (this.$generalHandle(status, result)) return;

      this.metas.list = result;

      if (!this.resource._id) {
        for (const metaField of result) {
          if ('default' in metaField) {
            this.resource[metaField.key] = metaField.default;
          }
        }
      }
      
    },
    async submit() {

      this.loading = true;

      const payload = { ...this.resource };

      if (this.resource._id) {

        const { status, result } = await YNetwork.patch(`${this.apiBase}/${this.modelName.toLowerCase() + 's'}/${this.resource._id}`, payload);
        this.loading = false;

        if (this.$generalHandle(status, result)) return;

      }
      else {
        
        const { status, result } = await YNetwork.post(`${this.apiBase}/${this.modelName.toLowerCase() + 's'}`, payload);
        this.loading = false;

        if (this.$generalHandle(status, result)) return;

      }

      this.loading = false;

      this.$toast.success('درخواست شما انجام شد.');

      this.$emit('resolve', true);

    },
    mapMetaType(meta) {

      if (meta.type === 'string' && meta.ref === 'Media') return 'file';

      if (meta.ref) return 'resource';

      if (meta.isArray) return 'select';

      switch (meta.type) {
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