<template>
  <v-text-field
    :filled="!field.unfilled"
    :label="field.title"
    :value="resourceTitle"
    :loading="loading"
    :dense="field.dense"
    :solo="field.simple"
    :flat="field.simple"
    :dir="field.dir"
    :background-color="field.background"
    :disabled="field.disabled"
    readonly
    :autofocus="field.autofocus"
    @click.native="openSelectResourceDialog"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    hide-details="auto"
  />
</template>

<script>

import YNetwork from 'ynetwork';
import { transformResourceToTitle, loadMetasFor, loadRelationsFor, transformRelationToTitle } from '../../y-resource-manager/y-resource-util';

export default {
  name: 'YFormElementResource',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    items: [],
    loading: false,
    resourceTitle: ''
  }),
  watch: {
    'value'() {
      this.makeResourceTitle();
    }
  },
  computed: {
    isRelation() {
      return this.field.relationSourceModel && this.field.relationTargetModel;
    }
  },
  mounted() {
    this.makeResourceTitle();
  },
  methods: {
    async makeResourceTitle() {

      this.resourceTitle = '';
      if (!this.value) return;

      this.loading = true;

      const titleMaker = this.isRelation ?
        async (id) => transformRelationToTitle(this.$apiBase, this.field.resource, id, this.field.relationSourceModel, this.field.relationTargetModel)
        :
        async (id) => transformResourceToTitle(this.$apiBase, this.field.resource, id);

      if (!this.field.multiple) {
        this.resourceTitle = await titleMaker(this.value);
      }
      else {
        this.resourceTitle = (await Promise.all(this.value.map(titleMaker))).join(' -- ');
      }

      this.loading = false;

    },
    async openSelectResourceDialog() {
      if (this.field.readonly) return;

      const result = await this.$dialog(import('../../y-resource-manager/y-resource-select-dialog'), {
        width: '900px',
        modelName: this.field.resource,
        title: this.field.title,
        relationSourceModel: this.field.relationSourceModel,
        relationTargetModel: this.field.relationTargetModel,
        multiple: this.field.multiple,
        preSelection: this.value
      }); if (!result) return;

      this.$emit('input', result);

    },
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

    },
    validateValue() {
      if (!this.field.rules || this.field.rules.length === 0) {
        this.$emit('validate', undefined);
        return;
      }

      for (const rule of this.field.rules || []) {
        const result = rule(this.value);
        if (typeof result === 'boolean' && !result || typeof result === 'string') {
          this.$emit('validate', result);
          return;
        }
      } this.$emit('validate', true);

    }
  }
}

</script>
