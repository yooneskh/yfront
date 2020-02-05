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
import { transformResourceToTitle } from '../../y-resource-manager/y-resource-util';

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
  computed: {
    isRelation() {
      return this.field.relationSourceModel && this.field.relationTargetModel;
    }
  },
  mounted() {
    if (this.isRelation) {
      this.loadRelationicData();
    }
    else {
      this.loadData();
    }
  },
  methods: {
    async loadData() {

      const resourceUrl = this.field.resource.toLowerCase() + 's';

      const [{ result: metas }, { result: items }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${resourceUrl}/metas`),
        YNetwork.get(`${this.$apiBase}/${resourceUrl}`)
      ]);

      const titleables = metas.filter(meta => meta.titleAble).map(meta => meta.key);

      this.items = await Promise.all(
        items.map(async item => {

          const titleParts = await Promise.all(
            titleables.map(async fieldKey => {

              const arrayedValues = Array.isArray(item[fieldKey]) ? item[fieldKey] : [item[fieldKey]];

              const meta = metas.find(meta => meta.key === fieldKey);

              if (!meta.ref) return arrayedValues.join(', ');

              return (await Promise.all(
                arrayedValues.map(async value => transformResourceToTitle(this.$apiBase, meta.ref, value))
              )).join(', ');

            })
          );

          return ({
            value: item._id,
            text: titleParts.join(' ')
          });

        })
      );
      
    },
    async loadRelationicData() {

      const targetName = (this.field.resource || this.field.relationTargetModel).toLowerCase();
      const sourceName = this.field.relationSourceModel.toLowerCase();

      const [{ result: allData }, { result: relations }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${sourceName}s/${targetName}s`),
        YNetwork.get(`${this.$apiBase}/${sourceName}s/relations`)
      ]);

      const relationMeta = relations.find(relation => relation.targetModel === this.field.relationTargetModel);

      this.items = await Promise.all(
        allData.map(async item => {
          
          const [sourceTitle, targetTitle] = await Promise.all([
            transformResourceToTitle(this.$apiBase, this.field.relationSourceModel, item[this.field.relationSourceModel.toLowerCase()]),
            transformResourceToTitle(this.$apiBase, this.field.relationTargetModel, item[this.field.relationTargetModel.toLowerCase()])
          ]);

          const otherDataTitles = await Promise.all(
            relationMeta.properties.filter(p => p.titleable).map(async meta => {

              const arrayedValues = Array.isArray(item[meta.key]) ? item[meta.key] : [item[meta.key]];

              if (!meta.ref) return arrayedValues.join(', ');

              return (await Promise.all(
                arrayedValues.map(async value => transformResourceToTitle(this.$apiBase, meta.ref, value))
              )).join(', ');

            })
          );

          return {
            value: item._id,
            text: [sourceTitle, targetTitle, ...otherDataTitles].join(' ')
          };

        })
      );

    }

  }
}

</script>
