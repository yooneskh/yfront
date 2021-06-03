<template>
  <v-card flat>

    <v-card-title>مجموعه داده {{ meta.title }}</v-card-title>

    <y-table
      :headers="headers"
      :items="data">
      <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ data }">
        <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
      </template>
    </y-table>

  </v-card>
</template>

<script>
export default {
  name: 'YResourceSeriesVisualizerDialog',
  components: {
    'y-resource-table-cell': () => import('./y-resource-table-cell.vue' /* webpackChunkName: 'y-resource-table-cell' */),
  },
  props: {
    meta: {
      type: Array,
      required: true
    },
    data: {
      type: Array
    }
  },
  computed: {
    headers() {
      return this.meta
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
};
</script>
