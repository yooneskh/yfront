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

    <div v-if="multiple && selectedItems.length > 0" class="pa-2 pb-1">
      <v-chip v-for="(item, index) in selectedItems" :key="item._id" small class="me-2 mb-1" close @click:close="selectedItems.splice(index, 1)">

        {{ titles[item] || '---' }}

        <div class="ms-2 me-n1">
          <v-btn v-if="index > 0" x-small icon @click="moveSelectedItem(index, index - 1)">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn v-if="index < selectedItems.length - 1" x-small icon @click="moveSelectedItem(index, index + 1)">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

      </v-chip>
    </div>

    <y-table
      :headers="headers"
      :items="notSelectedItems"
      :server-items-length="allItemsCount"
      :sorts.sync="sorts"
      @update:page="page = $event"
      :items-per-page="itemsPerPage"
      @update:items-per-page="itemsPerPage = $event"
      :actions="[
        { key: 'select', icon: 'mdi-plus', color: 'primary' }
      ]"
      @select="handleItemClick">
      <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ data }">
        <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
      </template>
    </y-table>

  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';
import { loadMetasFor, transformFilters, transformSorts, transformResourceToTitle, transformRelationToTitle, pluralizeModelName } from './y-resource-util';
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
    allItemsCount: 0,
    filters: [],
    sorts: {},
    page: 1,
    itemsPerPage: 5,
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
    }
  },
  watch: {
    page() {
      this.loadData();
    },
    itemsPerPage() {
      this.loadData();
    },
    sorts() {
      this.loadData();
    },
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
          if (this.relationSourceModel && this.relationTargetModel) {
            this.$set(this.titles, selection, await transformRelationToTitle(this.$apiBase, this.modelName, selection, this.relationSourceModel, this.relationTargetModel));
          }
          else {
            this.$set(this.titles, selection, await transformResourceToTitle(this.$apiBase, this.modelName, selection));
          }
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
      const sorts = transformSorts(this.sorts);
      const skip = (this.page - 1) * this.itemsPerPage;
      const limit = this.itemsPerPage;

      this.loading = true;
      const [{ status, result }, { status: s2, result: r2 }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}?skip=${skip}&limit=${limit}&${transformedFilters}&${sorts}`),
        YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}/count?${transformedFilters}`)
      ]);
      this.loading = false;
      if (this.$generalHandle(status, result) || this.$generalHandle(s2, r2)) return;

      this.items = result;
      this.allItemsCount = r2;

    },
    async setupRelations() {

      this.loadRelationsData();

      const { result } = await YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.relationSourceModel)}/relations`);
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
      const sorts = transformSorts(this.sorts);
      const skip = (this.page - 1) * this.itemsPerPage;
      const limit = this.itemsPerPage;

      const targetName = pluralizeModelName(this.modelName || this.relationTargetModel);
      const sourceName = pluralizeModelName(this.relationSourceModel);

      this.loading = true;
      const [{ status, result }, { status: s2, result: r2 }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${sourceName}/${targetName}?skip=${skip}&limit=${limit}&${transformedFilters}&${sorts}`),
        YNetwork.get(`${this.$apiBase}/${sourceName}/${targetName}/count?${transformedFilters}`)
      ]);
      this.loading = false;
      if (this.$generalHandle(status, result) || this.$generalHandle(s2, r2)) return;

      this.items = result;
      this.allItemsCount = r2;

    },
    async handleItemClick(item) {

      if (!this.multiple) {
        this.$emit('resolve', item._id);
        return;
      }

      this.selectedItems.push(item._id);

      if (this.relationSourceModel && this.relationTargetModel) {
        this.$set(this.titles, item._id, await transformRelationToTitle(this.$apiBase, this.modelName, item._id, this.relationSourceModel, this.relationTargetModel));
      }
      else {
        this.$set(this.titles, item._id, await transformResourceToTitle(this.$apiBase, this.modelName, item._id));
      }

    },
    moveSelectedItem(fromIndex, toIndex) {

      const newSelectedItems = [...this.selectedItems];

      [newSelectedItems[fromIndex], newSelectedItems[toIndex]] = [newSelectedItems[toIndex], newSelectedItems[fromIndex]];
      [this.titles[fromIndex], this.titles[toIndex]] = [this.titles[toIndex], this.titles[fromIndex]];

      this.selectedItems = newSelectedItems;

    }
  }
}

</script>
