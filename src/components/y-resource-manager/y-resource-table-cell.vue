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
export default {
  name: 'YResourceCell',
  components: {
    'y-resource-visualizer': () => import('./y-resource-visualizer' /* webpackChunkName: 'y-resource-visualizer' */)
  },
  props: {
    header: {},
    data: {}
  }
}
</script>
