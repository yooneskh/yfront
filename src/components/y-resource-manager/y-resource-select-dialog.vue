<template>
  <v-card :loading="loading">
    
    <v-card-title class="pe-3">
      انتخاب {{ title || 'آیتم' }}
      <v-spacer />
      <v-btn v-if="multiple" text color="primary" @click="$emit('resolve', selectedItems)">
        انتخاب
        <v-icon right>mdi-check</v-icon>
      </v-btn>
    </v-card-title>

    <y-resource-filter v-model="filters" :metas="metas" />

    <div v-if="multiple && selectedItems.length > 0" class="pa-2">
      <v-chip v-for="(item, index) in selectedItems" :key="item._id" small class="me-2" close @click:close="selectedItems.splice(index, 1)">
        {{ titles[item] || '---' }}
      </v-chip>
    </div>

    <y-table
      :headers="headers"
      :items="notSelectedItems"
      :actions="[
        { key: 'select', icon: 'mdi-plus', color: 'primary' }
      ]"
      @select="handleItemClick">

      <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ header, data }">
        <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
      </template>

    </y-table>

  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';
import { loadMetasFor, transformFilters, transformResourceToTitle } from './y-resource-util';
import debounce from 'lodash/debounce';

export default {
  name: 'YResourceSelectDialog',
  components: {
    'y-resource-filter': require('./y-resource-filter').default,
    'y-resource-table-cell': require('./y-resource-table-cell').default
  },
  props: {
    modelName: {
      type: String,
      required: true
    },
    title: String,
    relationSourceModel: String,
    relationTargetModel: String,
    multiple: Boolean,
    preSelection: {}
  },
  data: () => ({
    loading: false,
    filters: [],
    metas: [],
    items: [],
    selectedItems: [],
    titles: {}
  }),
  computed: {
    notSelectedItems() {
      return this.items.filter(item => !this.selectedItems.find(si => si === item._id));
    },
    headers() {
      return this.metas
        .filter(header => !header.hideInTable)
        .map(meta => ({
          ...meta,
          text: meta.title || meta.key,
        }))
        .concat([
          {
            key: 'createdAt',
            text: 'زمان ایجاد',
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          },
          {
            key: 'updatedAt',
            text: 'زمان تغییر',
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          }
        ]);
    }
  },
  watch: {
    filters: {
      deep: true,
      handler: debounce(function() {
        this.loadData();
      }, 500)
    }
  },
  async mounted() {
    this.checkPreSelection();
    this.setup();
  },
  methods: {
    async checkPreSelection() {
      if (this.preSelection && this.multiple) {

        this.selectedItems = this.preSelection;
        
        this.preSelection.forEach(async selection => {
          this.$set(this.titles, selection, await transformResourceToTitle(this.$apiBase, this.modelName, selection));
        });
        
      }
    },
    async setup() {
      if (this.relationSourceModel && this.relationTargetModel) {
        this.setupRelations();
      }
      else {
        this.loadNormalData();
        this.metas = await loadMetasFor(this.$apiBase, this.modelName);
      }
    },
    async loadData() {
      if (this.relationSourceModel && this.relationTargetModel) {
        this.loadRelationsData();
      }
      else {
        this.loadNormalData();
      }
    },
    async loadNormalData() {

      const transformedFilters = transformFilters(this.filters);

      this.loading = true;
      const { result } = await YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase()}s?${transformedFilters}`)
      this.loading = false;

      this.items = result;
      
    },
    async setupRelations() {

      this.loadRelationsData();

      const { result } = await YNetwork.get(`${this.$apiBase}/${this.relationSourceModel.toLowerCase()}s/relations`);
      const relation = result.find(r => r.targetModel === this.relationTargetModel);

      this.metas = [
        {
          key: this.relationSourceModel.toLowerCase(),
          type: 'string',
          ref: this.relationSourceModel,
          title: relation.sourcePropertyTitle || this.relationSourceModel,
          required: true
        },
        {
          key: this.relationTargetModel.toLowerCase(),
          type: 'string',
          ref: this.relationTargetModel,
          title: relation.targetPropertyTitle,
          required: true
        },
        ...relation.properties
      ];

    },
    async loadRelationsData() {

      const transformedFilters = transformFilters(this.filters);

      const targetName = (this.modelName || this.relationTargetModel).toLowerCase();
      const sourceName = this.relationSourceModel.toLowerCase();

      this.loading = true;
      const { result } = await YNetwork.get(`${this.$apiBase}/${sourceName}s/${targetName}s?${transformedFilters}`)
      this.loading = false;

      //     resource.title = await transformRelationToTitle(this.$apiBase, this.modelName, resource._id, this.relationSourceModel, this.relationTargetModel);

      this.items = result;

    },
    async handleItemClick(item) {

      if (!this.multiple) {
        this.$emit('resolve', item._id);
        return;
      }

      this.selectedItems.push(item._id);
      this.$set(this.titles, item._id, await transformResourceToTitle(this.$apiBase, this.modelName, item._id));

    }
  }
}

</script>