<template>
  <div class="y-resource-relation-manager">

    <v-card-title>
      {{ relation.title || relation.relationModelName || relation.targetModel }}
      <v-spacer />
      <v-btn color="primary" small text :disabled="resources.list.length >= maxRelationsCount" @click="initEditor(undefined)">
        افزودن &nbsp;
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </v-card-title>

    <y-table
      :headers="headers"
      :items="resources.list"
      :actions="[
        { key: 'edit', icon: 'mdi-pen' },
        { key: 'delete', icon: 'mdi-delete', color: 'error' }
      ]"
      @edit="initEditor"
      @delete="deleteRelation">

      <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ header, data }">
        <y-resource-table-cell :key="header.key" :data="data" :header="header" />
      </template>

    </y-table>

  </div>
</template>

<script>

import YNetwork from 'ynetwork';

export default {
  name: 'YResourceRelationManager',
  components: {
    'y-resource-table-cell': () => import('./y-resource-table-cell' /* webpackChunkName: 'y-resource-table-cell' */)
  },
  props: {
    sourceModel: String,
    sourceId: String,
    relation: { required: true }
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
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            class: 'text-center ltred'
          },
          {
            key: 'updatedAt',
            text: 'زمان تغییر',
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            class: 'text-center ltred'
          }
        ]);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.$apiBase}/${this.sourceModel.toLowerCase()}s/${this.sourceId}/${this.modelName.toLowerCase()}s`);
      this.loading = false;

      if (this.$generalHandle(status, result)) return;

      this.resources.list = result;

    },
    async initEditor(relation) {

      const toEdit = !!relation;

      const title = toEdit ? 'ویرایش' : `افزودن`;
      const actionTitle = toEdit ? 'ویرایش' : `افزودن`;

      const fields = this.relation.properties.map(meta => ({
        ...meta,
        title: meta.title || meta.key,
        type: this.mapMetaType(meta),
        wrapped: false, // for the file picker
        multiple: meta.isArray, // for select
        addable: meta.isArray, // for select again :D
        resource: meta.ref
      }));

      fields.unshift({
        key: this.relation.targetModel.toLowerCase(),
        type: 'resource',
        resource: this.relation.targetModel,
        title: this.relation.targetPropertyTitle
      });
      
      const form = await this.$dialogFormMaker(title, fields, actionTitle, relation, { width: 550 });

      const url = `${this.$apiBase}/${this.sourceModel.toLowerCase() + 's'}/${this.sourceId}/${this.modelName.toLowerCase() + 's'}/${form[this.relation.targetModel.toLowerCase()]}`;

      const payload = { ...form };
      delete payload[this.modelName.toLowerCase()];

      if (!toEdit) {

        this.loading = true;
        const { status, result } = await YNetwork.post(url, payload);
        this.loading = false;
  
        if (this.$generalHandle(status, result)) return;
  
        this.loadData();

      }
      else {

        this.loading = true;
        const { status, result } = await YNetwork.patch(url + '/' + relation._id, payload);
        this.loading = false;
  
        if (this.$generalHandle(status, result)) return;
  
        this.loadData();

      }


    },
    async deleteRelation(relation) {
      if (await this.$dialogConfirmDelete()) {
        
        const url = `${this.$apiBase}/${this.sourceModel.toLowerCase() + 's'}/${this.sourceId}/${this.modelName.toLowerCase() + 's'}/${relation[this.relation.targetModel.toLowerCase()]}/${relation._id}`;

        const { status, result } = await YNetwork.delete(url);

        if (this.$generalHandle(status, result)) return;

        this.loadData();

      }
    },
    mapMetaType(meta) {

      if (meta.type === 'string' && meta.ref === 'Media') return 'file';

      if (meta.ref) return 'resource';

      if (meta.isArray) return 'select';

      if (meta.languages) return 'text-multilang';
      if (meta.richText) return 'editor';

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