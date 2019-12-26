<template>
  <div class="filter-element">

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      v-model="filter.key"
      :items="metas.map(meta => ({ value: meta.key, text: meta.title }))"
      style="width: 120px;"
    />

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      :items="$options.Operators"
      v-model="filter.operator"
      style="width: 85px;"
    />

    <!-- <v-text-field
      class="small-text"
      placeholder="جستجو"
      dense solo flat hide-details
      background-color="transparent"
      v-model="filter.value"
      style="width: 120px;"
    /> -->
    <y-form
      class="small-text"
      :target="filter"
      :fields="valueField"
      style="width: 120px"
    />

  </div>
</template>

<script>
export default {
  name: 'YResourceFilterElement',
  props: {
    metas: Array,
    filter: Object
  },
  computed: {
    valueField() {

      const currentMeta = this.metas.find(meta => meta.key === this.filter.key);

      if (!currentMeta) return [];

      currentMeta.type = 'text';

      if (currentMeta.ref) {
        return [ { key: 'value', type: 'text', placeholder: 'جستجو', hideDetails: true, dense: true, simple: true, background: 'transparent' } ];
      }
      else if (currentMeta.type === 'boolean') {
        return [ { key: 'value', type: 'checkbox', hideDetails: true, title: 'مقدار' } ];
      }
      else {
        return [ { key: 'value', type: 'text', placeholder: 'جستجو', number: currentMeta.type === 'number', hideDetails: true, dense: true, simple: true, background: 'transparent' } ];
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .small-text {
      .v-input__slot {
        padding: 0 4px !important;
      }
      input, .v-select__selection {
        font-size: 0.75rem !important;
      }
      .v-input--selection-controls {
        margin-top: 4px !important;
      }
    }
  }
</style>