<template>
  <v-card :loading="allLoading">
    <v-row no-gutters>
      
      <v-col :cols="!showRelations ? 12 : 4">
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
      </v-col>

      <v-col v-if="showRelations" cols="8" style="border-right: 1px solid rgba(0, 0, 0, 0.1)">
        <y-resource-relation-manager
          v-for="relation in relations.list"
          :key="relation.relationModelName || relation.targetName"
          class="mt-2"
          :source-model="modelName"
          :source-id="resource._id"
          :relation="relation"
        />
      </v-col>

    </v-row>
  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';
import { loadMetasFor, loadRelationsFor } from './y-resource-util';

export default {
  name: 'YResourceDialog',
  components: {
    'y-resource-relation-manager': require('./y-resource-relation-manager').default
  },
  props: {
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
    metasLoading: false,
    relationsLoading: false,
    resource: {},
    metas: {
      list: []
    },
    relations: {
      list: []
    }
  }),
  computed: {
    fields() {
      return this.metas.list.map(meta => ({
        ...meta,
        title: meta.title || meta.key,
        type: this.mapMetaType(meta),
        number: meta.type === 'number',
        wrapped: false, // for the file picker
        multiple: meta.isArray, // for select
        addable: meta.isArray, // for select
        resource: meta.ref,
        readonly: this.readonly
      }));
    },
    allLoading() {
      return this.loading || this.metasLoading || this.relationsLoading;
    },
    showRelations() {
      return this.relations.list.length > 0 && this.resource._id;
    }
  },
  mounted() {
    
    this.loadMeta();

    if (this.baseResource) {
      Object.assign(this.resource, this.baseResource);
      this.loadRelations();
    }

  },
  methods: {
    async loadMeta() {

      this.metasLoading = true;
      this.metas.list = await loadMetasFor(this.$apiBase, this.modelName);
      this.metasLoading = false;

      if (!this.resource._id) {
        for (const metaField of this.metas.list) {
          if ('default' in metaField) {
            this.resource[metaField.key] = metaField.default;
          }
        }
      }
      
    },
    async loadRelations() {

      this.relationsLoading = true;
      this.relations.list = await loadRelationsFor(this.$apiBase, this.modelName);
      this.relationsLoading = false;
      
      if (this.relations.list.length > 0) {
        this.$emit('update:width', '90%');
      }
      
    },
    async submit() {

      this.loading = true;

      const payload = { ...this.resource };

      Object.keys(payload).forEach(key => {
        if ( !this.metas.list.find(meta => meta.key === key) || ( this.baseResource && this.baseResource[key] === this.resource[key]) ) {
          delete payload[key];
        }
      });

      if (Object.keys(payload).length === 0) {
        this.$toast('تغییری انجام نشده است!');
        this.$emit('resolve', false);
        return;
      }

      if (this.resource._id) {

        const { status, result } = await YNetwork.patch(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/${this.resource._id}`, payload);
        this.loading = false;

        if (this.$generalHandle(status, result)) return;

      }
      else {
        
        const { status, result } = await YNetwork.post(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}`, payload);
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
        case 'string': return meta.languages ? 'text-multilang' : (meta.richText ? 'editor' : (meta.longText ? 'textarea' : 'text'));
        case 'number': return 'text';
        case 'boolean': return 'checkbox';
        default: return 'text';
      }

    }
  }
}

</script>