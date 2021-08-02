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
    :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
    persistent-hint
    :hide-details="!field.message && !field.hint">
    <template v-if="!field.disabled && !field.readonly && (field.multiple ? value && value.length : value)" #append>
      <v-btn icon small @click.stop.prevent="clearData">
        <v-icon small>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script>

import { YNetwork } from 'ynetwork';
import { transformResourceToTitle, loadMetasFor, loadRelationsFor, transformRelationToTitle } from '../../y-resource-manager/y-resource-util';
import { YFormElementMixin } from 'ykh-form-extended';

export default {
  name: 'YFormElementResource',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    items: [],
    loading: false,
    resourceTitle: ''
  }),
  computed: {
    isRelation() {
      return this.field.relationSourceModel && this.field.relationTargetModel;
    }
  },
  watch: {
    value() {
      this.makeResourceTitle();
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
      if (this.field.readonly || this.field.disabled) return;

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

      await this.$nextTick();
      this.validateValue();

    },
    async loadData() {

      const resourceUrl = this.field.resource.toLowerCase() + 's';

      const [{ data: metas }, { data: items }] = await Promise.all([
        new Promise(resolve =>
          loadMetasFor(this.$apiBase, this.field.resource).then(rs => resolve({
            status: 200,
            data: rs
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

      const [{ data: allData }, { data: relations }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${sourceName}s/${targetName}s`),
        new Promise(resolve =>
          loadRelationsFor(this.$apiBase, this.field.relationSourceModel).then(rs => resolve({
            status: 200,
            data: rs
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
    async clearData() {
      this.$emit('input', this.field.multiple ? [] : null);
      await this.$nextTick();
      this.validateValue();
    }
  }
}

</script>
