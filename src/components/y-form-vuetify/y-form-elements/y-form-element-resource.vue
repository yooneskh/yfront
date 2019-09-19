<template>
  <v-autocomplete v-model="target[field.key]" :label="field.title" :items="items" :multiple="field.multiple" />
</template>

<script>

import YNetwork from 'ynetwork';

export default {
  name: 'YFormElementResource',
  props: {
    target: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    items: []
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {

      const resourceUrl = this.field.resource.toLowerCase() + 's'; // TODO: this might make problem! correct pluralize

      const metas = (await YNetwork.get(`${this.field.apiBase}/${resourceUrl}/meta`)).result;
      const items = (await YNetwork.get(`${this.field.apiBase}/${resourceUrl}`)).result;

      const titleables = metas.filter(meta => meta.titleAble).map(meta => meta.key);

      const itemTitler = (item) => titleables.map(field => item[field]).join(' ');

      this.items = items.map(item => ({
        value: item._id,
        text: itemTitler(item)
      }));
      
    }
  }
}

</script>
