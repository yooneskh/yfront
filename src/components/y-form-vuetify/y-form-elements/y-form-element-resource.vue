<template>
  <v-select v-model="target[field.key]" :label="field.title" :items="items" :multiple="field.multiple" />
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

      const resourceUrl = this.field.resource.toLowerCase() + 's';

      const metas = (await YNetwork.get(`${this.field.apiBase}/${resourceUrl}/meta`)).result;
      const items = (await YNetwork.get(`${this.field.apiBase}/${resourceUrl}`)).result;

      this.items = items.map(item => ({
        value: item._id,
        text: item.firstName || item.name
      }));
      
    }
  }
}

</script>
