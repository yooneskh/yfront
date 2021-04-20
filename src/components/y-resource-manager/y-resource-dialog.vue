<template>
  <v-card :loading="allLoading">
    <v-row no-gutters>

      <v-col :cols="!showRelations ? 12 : 4">
        <v-card-title>
          {{ readonly ? ('مشاهده') : (resource._id ? 'ویرایش' : 'افزودن') }} مورد
        </v-card-title>
        <v-card-text class="pb-1">
          <y-form
            ref="theForm"
            :valid.sync="isValid"
            :target="resource"
            :fields="fields"
          />
        </v-card-text>
        <v-card-actions v-if="!readonly">
          <v-btn text color="primary" :disabled="!isValid" @click="submit">
            {{ resource._id ? 'ویرایش' : 'افزودن' }}
          </v-btn>
        </v-card-actions>
      </v-col>

      <v-col v-if="showRelations" cols="8" style="border-right: 1px solid rgba(0, 0, 0, 0.1)">
        <y-resource-relation-manager
          v-for="relation in relations.list"
          :key="relation.relationModelName || relation.targetName"
          class="mb-2"
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
import { loadMetasFor, loadRelationsFor, mapMetaToFormFields, pluralizeModelName } from './y-resource-util';

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
    isValid: undefined,
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

      if (!this.baseResource) {
        return mapMetaToFormFields(
          this.metas.list.filter(it => !it.readonly && !it.disabled && !it.nonCreating),
          this.readonly
        );
      }

      return mapMetaToFormFields(this.metas.list, this.readonly);

    },
    allLoading() {
      return this.loading || this.metasLoading || this.relationsLoading;
    },
    showRelations() {
      return this.relations.list.length > 0 && this.resource._id;
    }
  },
  mounted() {

    this.loadMeta().then(async () => {
      await this.$nextTick();

      if (!this.resource._id) {
        this.isValid = !this.fields.some(it => it.rules && it.rules.length > 0)
      }
      else {
        this.$refs.theForm.revalidateAll();
      }

    });

    if (this.baseResource) {
      this.resource = JSON.parse(JSON.stringify(this.baseResource));
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

        const { status, result } = await YNetwork.patch(`${this.$apiBase}/${pluralizeModelName(this.modelName)}/${this.resource._id}`, payload);
        this.loading = false;
        if (this.$generalHandle(status, result)) return;

        this.$toast.success('ویرایش انجام شد.');

      }
      else {

        const { status, result } = await YNetwork.post(`${this.$apiBase}/${pluralizeModelName(this.modelName)}`, payload);
        this.loading = false;
        if (this.$generalHandle(status, result)) return;

        this.$toast.success('افزودن انجام شد.');

      }

      this.$emit('resolve', true);

    }
  }
}

</script>