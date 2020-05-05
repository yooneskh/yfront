<template>
  <v-card :loading="loading">
    
    <y-resource-filter v-model="filters" :metas="metas" />

    <div v-if="items.length === 0" class="pa-6 text-center">
      <span class="caption">هیچ داده‌ای موجود نیست.</span>
    </div>
    <v-list v-else>
      <v-list-item v-for="item in items" :key="item._id" @click="$emit('resolve', item._id)">
        <v-list-item-icon class="me-4">
          <v-icon>mdi-chevron-left</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

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
    relationTargetModel: String
  },
  data: () => ({
    loading: false,
    filters: [],
    metas: [],
    items: []
  }),
  computed: {

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

    }
  }
}

</script>