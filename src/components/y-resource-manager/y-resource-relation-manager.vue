<template>
  <div class="y-resource-relation-manager">

    <v-card-title class="pe-3">
      {{ relation.title || relation.relationModelName || relation.targetModel }}
      <v-spacer />
      <v-btn color="primary" text :disabled="resources.list.length >= maxRelationsCount" @click="initEditor(undefined)">
        افزودن
        <v-icon right>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <y-table
      :headers="headers"
      :items="resources.list"
      :actions="tableActions"
      @edit="initEditor"
      @delete="deleteRelation">
      <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ data }">
        <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
      </template>
    </y-table>

  </div>
</template>

<script>

import YNetwork from 'ynetwork';
import { mapMetaToFormFields, pluralizeModelName } from './y-resource-util';

export default {
  name: 'YResourceRelationManager',
  components: {
    'y-resource-table-cell': require('./y-resource-table-cell').default
  },
  props: {
    sourceModel: String,
    sourceId: String,
    relation: {
      required: true
    }
  },
  data: () => ({
    loading: false,
    resources: {
      list: [],
      current: {}
    }
  }),
  computed: {
    maxRelationsCount() {
      if (this.relation.singular) return 1;
      if (this.relation.maxCount) return this.relation.maxCount;
      return Infinity;
    },
    modelName() {
      return this.relation.relationModelName || this.relation.targetModel;
    },
    hasRelationProperties() {
      return (this.relation.properties || []).filter(property => !property.hideInTable).length > 0;
    },
    headers() {
      return [
        {
          key: this.relation.targetModel.toLowerCase(),
          text: this.relation.targetPropertyTitle,
          ref: this.relation.targetModel
        }
      ].concat(this.relation.properties
        .filter(header => !header.hideInTable)
        .map(meta => ({
          ...meta,
          text: meta.title || meta.key,
        })))
        .concat([
          {
            key: 'createdAt',
            text: 'زمان ایجاد',
            labelFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          },
          {
            key: 'updatedAt',
            text: 'زمان تغییر',
            labelFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          }
        ]);
    },
    tableActions() {

      const result = [];

      if (this.hasRelationProperties) {
        result.push({ key: 'edit', icon: 'mdi-pen' });
      }

      result.push({ key: 'delete', icon: 'mdi-delete', color: 'error' });

      return result;

    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.sourceModel)}/${this.sourceId}/${pluralizeModelName(this.modelName)}`);
      this.loading = false;
      if (this.$generalHandle(status, result)) return;

      this.resources.list = result;

    },
    async initEditor(relation) {

      const toEdit = !!relation;
      const title = toEdit ? 'ویرایش' : `افزودن`;
      const actionTitle = toEdit ? 'ویرایش' : `افزودن`;

      const fields = toEdit ? mapMetaToFormFields(this.relation.properties) : mapMetaToFormFields(this.metas.list.filter(it => !it.readonly && !it.disabled));

      if (!toEdit) {
        fields.unshift({
          key: this.relation.targetModel.toLowerCase(),
          type: 'resource',
          resource: this.relation.targetModel,
          title: this.relation.targetPropertyTitle
        });
      }

      const form = await this.$dialogFormMaker({
        title,
        fields,
        actionTitle,
        values: relation && JSON.parse(JSON.stringify(relation))
      }); if (!form) return;

      const url = `${this.$apiBase}/${pluralizeModelName(this.sourceModel)}/${this.sourceId}/${pluralizeModelName(this.modelName)}/${form[this.relation.targetModel.toLowerCase()]}`;

      const payload = { ...form };

      if (toEdit) {
        Object.keys(payload).forEach(key => {
          if (relation[key] === payload[key]) {
            delete payload[key];
          }
        });
      }

      if (Object.keys(payload).length === 0) {
        this.$toast('تغییری انجام نشده است!');
        this.$emit('resolve', false);
        return;
      }

      delete payload[this.modelName.toLowerCase()];
      delete payload[this.relation.targetModel.toLowerCase()];

      if (!toEdit) {

        this.loading = true;
        const { status, result } = await YNetwork.post(url, payload);
        this.loading = false;
        if (this.$generalHandle(status, result)) return;

        this.$toast.success('افزودن با موفقیت انجام شد.');
        this.loadData();

      }
      else {

        this.loading = true;
        const { status, result } = await YNetwork.patch(url + '/' + relation._id, payload);
        this.loading = false;
        if (this.$generalHandle(status, result)) return;

        this.$toast.success('ویرایش با موفقیت انجام شد.');
        this.loadData();

      }

    },
    async deleteRelation(relation) {
      if (!await this.$dialogConfirmDelete()) return;

      const url = `${this.$apiBase}/${pluralizeModelName(this.sourceModel)}/${this.sourceId}/${pluralizeModelName(this.modelName)}/${relation[this.relation.targetModel.toLowerCase()]}/${relation._id}`;

      const { status, result } = await YNetwork.delete(url);
      if (this.$generalHandle(status, result)) return;

      this.$toast.success('حذف با موفقیت انجام شد.');
      this.loadData();

    }
  }
}
</script>