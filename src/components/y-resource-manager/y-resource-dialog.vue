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

        <v-card-text v-if="validationMessages">
          <v-card color="error" dark elevation="0">
            <v-list dense style="background: transparent;">
              <v-list-item v-for="error of Object.values(validationMessages).flatMap(it => it)" :key="error">
                {{ error }}
              </v-list-item>
            </v-list>
          </v-card>
        </v-card-text>

        <v-card-actions v-if="!readonly">
          <v-btn text color="primary" :disabled="!isValid || validating || !!validationMessages || blockForValidate" @click="submit">
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

import YResourceRelationManager from './y-resource-relation-manager.vue';

import { YNetwork } from 'ynetwork';
import { loadMetasFor, loadRelationsFor, mapMetaToFormFields, pluralizeModelName } from './y-resource-util';
import debounce from 'lodash/debounce';

export default {
  name: 'YResourceDialog',
  components: {
    'y-resource-relation-manager': YResourceRelationManager
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
    },
    validating: false,
    blockForValidate: false,
    hasValidation: false,
    validationMessages: undefined
  }),
  computed: {
    pluralModelName() {
      return pluralizeModelName(this.modelName);
    },
    fields() {

      let fields = [];

      if (!this.baseResource) {
        fields = mapMetaToFormFields(
          this.metas.list.filter(it => !it.readonly && !it.disabled && !it.nonCreating),
          this.readonly
        );
      }
      else {
        fields = mapMetaToFormFields(this.metas.list, this.readonly);
      }

      return fields.map(it => ({
        ...it,
        error: it.key in (this.validationMessages || {}),
        message: this.validationMessages?.[it.key]?.join(' - ')
      }));

    },
    allLoading() {
      return this.loading || this.metasLoading || this.relationsLoading || this.validating;
    },
    showRelations() {
      return this.relations.list.length > 0 && this.resource._id;
    }
  },
  watch: {
    'resource': {
      deep: true,
      handler() {
        if (this.hasValidation) {
          this.blockForValidate = true;
          this.validateResource();
        }
      }
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

    this.checkValidations();

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
    async checkValidations() {
      this.hasValidation = (await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/validate`)).data === true;
    },
    validateResource: debounce(async function() {

      const payload = JSON.parse(JSON.stringify(this.resource));

      this.blockForValidate = false;
      this.validating = true;
      const { status, data } = await YNetwork.post(`${this.$apiBase}/${this.pluralModelName}/validate`, payload);
      this.validating = false;
      if (status === 200) return this.validationMessages = undefined;

      const { validations } = data;
      const messages = {};

      for (const meta of this.metas.list) {

        const metaValidations = validations.filter(it => it.property === meta.key);
        const resourceValue = this.resource[meta.key];
        if (metaValidations.length === 0) continue;

        if (!meta.required && metaValidations.length > 0) {
          messages[meta.key] = metaValidations.map(it => it.error);
        }
        else if (meta.required) {
          if (resourceValue === undefined || resourceValue === null || resourceValue === '') {
            if (metaValidations.length > 1) {
              messages[meta.key] = metaValidations.slice(1).map(it => it.error);
            }
          }
          else {
            messages[meta.key] = metaValidations.map(it => it.error);
          }
        }

      }

      console.log(11111, messages);
      this.validationMessages = Object.keys(messages).length > 0 ? messages : undefined;

    }, 500),
    async submit() {

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

        this.loading = true;
        const { status, data } = await YNetwork.patch(`${this.$apiBase}/${this.pluralModelName}/${this.resource._id}/`, payload);
        this.loading = false;
        if (this.$generalHandle(status, data)) return;

        this.$toast.success('ویرایش انجام شد.');
        this.$emit('resolve', data);

      }
      else {

        this.loading = true;
        const { status, data } = await YNetwork.post(`${this.$apiBase}/${this.pluralModelName}/`, payload);
        this.loading = false;
        if (this.$generalHandle(status, data)) return;

        this.$toast.success('افزودن انجام شد.');
        this.$emit('resolve', data);

      }

    }
  }
};

</script>
