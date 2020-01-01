<template>
  <v-autocomplete
    :label="field.title"
    :items="items"
    :multiple="field.multiple"
    :value="value"
    :dense="field.dense"
    :solo="field.simple"
    :flat="field.simple"
    :background-color="field.background"
    :hide-details="field.hideDetails"
    @input="$emit('input', $event)"
  />
</template>

<script>

import YNetwork from 'ynetwork';

export default {
  name: 'YFormElementResource',
  props: {
    value: {

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

      const metas = (await YNetwork.get(`${this.$apiBase}/${resourceUrl}/metas`)).result;
      const items = (await YNetwork.get(`${this.$apiBase}/${resourceUrl}`)).result;

      const titleables = metas.filter(meta => meta.titleAble).map(meta => meta.key);

      const itemTitler = (item) => titleables.map(field =>
        Array.isArray(item[field]) ? item[field].join(', ') : item[field]
      ).join(' ');

      this.items = items.map(item => ({
        value: item._id,
        text: itemTitler(item)
      }));
      
    }
  }
}

</script>
