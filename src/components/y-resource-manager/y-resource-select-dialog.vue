<template>
  <v-card :loading="loading">
    
    <v-card-title>
      انتخاب آیتم
      <v-spacer />
      <v-btn v-if="multiple" text color="primary" @click="$emit('resolve', selectedItems.map(item => item._id))">
        انتخاب
        <v-icon right>mdi-check</v-icon>
      </v-btn>
    </v-card-title>
    <y-resource-filter v-model="filters" :metas="metas" />

    <div v-if="items.length === 0" class="pa-6 text-center">
      <span class="caption">هیچ داده‌ای موجود نیست.</span>
    </div>
    <div v-else>

      <div v-if="multiple && selectedItems.length > 0">
        <v-list class="grey lighten-4">
          <v-list-item v-for="(item, index) in selectedItems" :key="item._id" @click="selectedItems.splice(index, 1)">
            <v-list-item-icon class="me-4">
              <v-icon>mdi-check</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>

      <v-list>
        <v-list-item v-for="item in notSelectedItems" :key="item._id" @click="handleItemClick(item)">
          <v-list-item-icon class="me-4">
            <v-icon>mdi-chevron-left</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </div>

  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';
import { loadMetasFor, transformResourceToTitle, transformFilters, transformRelationToTitle } from './y-resource-util';
import debounce from 'lodash/debounce';

export default {
  name: 'YResourceSelectDialog',
  components: {
    'y-resource-filter': require('./y-resource-filter').default
  },
  props: {
    modelName: {
      type: String,
      required: true
    },
    relationSourceModel: String,
    relationTargetModel: String,
    multiple: Boolean
  },
  data: () => ({
    loading: false,
    filters: [],
    metas: [],
    items: [],
    selectedItems: []
  }),
  computed: {
    notSelectedItems() {
      return this.items.filter(item => !this.selectedItems.find(si => si._id === item._id));
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
    this.setup();
  },
  methods: {
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
      const { result } = await YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase()}s?${transformedFilters}&selects=_id`)

      await Promise.all(
        result.map(async resource => {
          resource.title = await transformResourceToTitle(this.$apiBase, this.modelName, resource._id);
        })
      );

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
      const { result } = await YNetwork.get(`${this.$apiBase}/${sourceName}s/${targetName}s?${transformedFilters}&selects=_id`)

      await Promise.all(
        result.map(async resource => {
          resource.title = await transformRelationToTitle(this.$apiBase, this.modelName, resource._id, this.relationSourceModel, this.relationTargetModel);
        })
      );

      this.loading = false;

      this.items = result;

    },
    handleItemClick(item) {

      if (!this.multiple) {
        this.$emit('resolve', item._id);
        return;
      }

      this.selectedItems.push(item);

    }
  }
}

</script>