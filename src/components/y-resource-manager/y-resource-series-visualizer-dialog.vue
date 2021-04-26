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

import YResourceTableCell from './y-resource-table-cell.vue';

export default {
  name: 'YResourceSeriesVisualizerDialog',
  components: {
    'y-resource-table-cell': YResourceTableCell
  },
  props: {
    meta: {
      type: Object,
      required: true
    },
    data: {
      type: Array
    }
  },
  computed: {
    headers() {
      return this.meta.serieSchema
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
