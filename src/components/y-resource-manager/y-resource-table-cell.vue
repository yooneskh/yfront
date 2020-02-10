<template>
  <div class="y-resource-cell">
    <template v-if="Array.isArray(data)">
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
      <v-btn small text @click="showResource">
        {{ relationTitle }}
      </v-btn>
    </template>
    <template v-else>
      <span v-if="header.timeFormat" :style="{'direction': header.dir}" class="d-inline-block">
        {{ data === 0 ? '-' : $formatTime(data, header.timeFormat) }}
      </span>
      <template v-else-if="header.ref">
        <y-resource-visualizer v-if="data" :model="header.ref" :id="data" />
      </template>
      <template v-else-if="header.type === 'boolean'">
        <v-icon :color="data ? 'success' : 'error'" >{{ data ? 'mdi-check' : 'mdi-close' }}</v-icon>
      </template>
      <span v-else :style="{'direction': header.dir}" class="d-inline-block">
        {{ data }}
      </span>
    </template>
  </div>
</template>

<script>

import YNetwork from 'ynetwork';
import { transformResourceToTitle, loadRelationsFor } from './y-resource-util';

export default {
  name: 'YResourceCell',
  components: {
    'y-resource-visualizer': () => import('./y-resource-visualizer' /* webpackChunkName: 'y-resource-visualizer' */)
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
    if (this.isRelation) {

      const targetName = (this.header.ref || this.header.relationTargetModel).toLowerCase();
      const sourceName = this.header.relationSourceModel.toLowerCase();

      const [{ result: relationData }, { result: relations }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${sourceName}s/${targetName}s/${this.data}`),
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

      this.sourceResourceData = (await YNetwork.get(`${this.$apiBase}/${sourceName}s/${this.relationSourceId}`)).result;

    }
  },
  methods: {
    async showResource() {
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

    }
  }
}

</script>
