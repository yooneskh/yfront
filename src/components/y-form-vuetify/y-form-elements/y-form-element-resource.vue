<template>
  <v-autocomplete
    filled 
    :label="field.title"
    :items="items"
    :multiple="field.multiple"
    :value="value"
    :dense="field.dense"
    :solo="field.simple"
    :flat="field.simple"
    :dir="field.dir"
    :background-color="field.background"
    hide-details
    @input="$emit('input', $event)"
  />
</template>

<script>

import YNetwork from 'ynetwork';
import { transformResourceToTitle, loadMetasFor, loadRelationsFor } from '../../y-resource-manager/y-resource-util';

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
        new Promise(resolve =>
          loadMetasFor(this.$apiBase, this.field.resource).then(rs => resolve({
            status: 200,
            result: rs
          }))
        ),
        YNetwork.get(`${this.$apiBase}/${resourceUrl}`)
      ]);

      const titleables = metas.filter(meta => meta.titleable).map(meta => meta.key);

      this.items = await Promise.all(
        items.map(async item => {

          const titleParts = await Promise.all(
            titleables.map(async fieldKey => {

              const arrayedValues = Array.isArray(item[fieldKey]) ? item[fieldKey] : [item[fieldKey]];

              const meta = metas.find(m => m.key === fieldKey);

              if (!meta.ref) return arrayedValues.join(', ');

              return (await Promise.all(
                arrayedValues.map(value => transformResourceToTitle(this.$apiBase, meta.ref, value))
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
        new Promise(resolve =>
          loadRelationsFor(this.$apiBase, this.field.relationSourceModel).then(rs => resolve({
            status: 200,
            result: rs
          }))
        )
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
                arrayedValues.map(value => transformResourceToTitle(this.$apiBase, meta.ref, value))
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
