<template>
  <div class="y-resource-cell">
    <template v-if="header.type === 'series'">
      <span class="primary--text caption text-decoration-underline" style="cursor: pointer" @click="showSeriesData(header, data)">
        نمایش مجموعه داده
      </span>
    </template>
    <template v-else-if="Array.isArray(data)">
      <YResourceCell v-for="dataElement in data" :key="dataElement" class="me-2 d-inline-block" :header="header" :data="dataElement" />
    </template>
    <template v-else-if="header.languages">
      <v-chip
        v-for="(config, language) in header.languages"
        :key="language"
        class="me-1"
        small>
        {{ language }}: {{ data[language] }}
      </v-chip>
    </template>
    <template v-else-if="isRelation">
      <span class="primary--text caption text-decoration-underline" style="cursor: pointer" @click="showResource">
        {{ relationTitle }}
      </span>
    </template>
    <template v-else>
      <span v-if="header.labelFormat || header.valueFormat" :style="{'direction': header.dir}" class="d-inline-block text-center">
        {{ !(data > 0) ? '-' : $formatTime(data, header.labelFormat || header.valueFormat) }}
      </span>
      <template v-else-if="header.ref">
        <y-resource-visualizer v-if="data" :model="header.ref" :id="data" />
      </template>
      <template v-else-if="header.type === 'boolean'">
        <v-icon :color="data ? 'success' : 'error'" >{{ data ? 'mdi-check' : 'mdi-close' }}</v-icon>
      </template>
      <span v-else :style="{'direction': header.dir}" class="d-inline-block" :class="{'ltred': header.type === 'number'}">
        {{ header.items && header.items.find(it => it.value === data) ? header.items.find(it => it.value === data).text : data }}
      </span>
    </template>
  </div>
</template>

<script>

import YResourceVisualizer from './y-resource-visualizer.vue';
import YResourceSeriesVisualizerDialog from './y-resource-series-visualizer-dialog.vue';

import YNetwork from 'ynetwork';
import { transformResourceToTitle, loadRelationsFor, pluralizeModelName } from './y-resource-util';

export default {
  name: 'YResourceCell',
  components: {
    'y-resource-visualizer': YResourceVisualizer
  },
  props: {
    header: {},
    data: {}
  },
  data: () => ({
    relationTitle: '',
    relationSourceId: '',
    sourceResourceData: {}
  }),
  computed: {
    isRelation() {
      return this.header.relationSourceModel && this.header.relationTargetModel;
    }
  },
  async mounted() {
    if (!Array.isArray(this.data) && this.isRelation) {

      const targetName = pluralizeModelName(this.header.ref || this.header.relationTargetModel);
      const sourceName = pluralizeModelName(this.header.relationSourceModel);

      const [{ result: relationData }, { result: relations }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${sourceName}/${targetName}/${this.data}`),
        new Promise(resolve =>
          loadRelationsFor(this.$apiBase, this.header.relationSourceModel).then(rs => resolve({
            status: 200,
            result: rs
          }))
        )
      ]);

      const relationMeta = relations.find(relation => relation.targetModel === this.header.relationTargetModel);
      this.relationSourceId = relationData[this.header.relationSourceModel.toLowerCase()];

      const [sourceTitle, targetTitle] = await Promise.all([
        transformResourceToTitle(this.$apiBase, this.header.relationSourceModel, this.relationSourceId),
        transformResourceToTitle(this.$apiBase, this.header.relationTargetModel, relationData[this.header.relationTargetModel.toLowerCase()])
      ]);

      this.relationTitle = sourceTitle + ' ' + targetTitle + ' ' + relationMeta.properties.filter(p => p.titleable).map(meta => relationData[meta.key]).join(' ');
      this.sourceResourceData = (await YNetwork.get(`${this.$apiBase}/${sourceName}/${this.relationSourceId}`)).result;

    }
  },
  methods: {
    showResource() {
      if (this.header.relationSourceModel === 'Media') {
        window.open(this.sourceResourceData.path, '_blank');
      }
      else {
        this.$dialog(import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
          width: '450px',
          modelName: this.header.relationSourceModel,
          baseResource: this.sourceResourceData,
          readonly: true
        });
      }
    },
    async showSeriesData(meta, data) {
      this.$dialog(YResourceSeriesVisualizerDialog, {
        width: 768,
        meta,
        data
      });
    }
  }
};

</script>
