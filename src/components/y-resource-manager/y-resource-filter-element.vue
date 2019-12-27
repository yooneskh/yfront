<template>
  <div class="filter-element">

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      v-model="filter.key"
      :items="metas.map(meta => ({ value: meta.key, text: meta.title }))"
      style="width: 110px;"
    />

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      :items="currentOperators"
      v-model="filter.operator"
      style="width: 90px;"
    />

    <y-form
      class="small-text"
      :target="filter"
      :fields="valueField"
      style="width: 110px;"
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
    currentMeta() {
      return this.metas.find(meta => meta.key === this.filter.key);
    },
    currentOperators() {

      const result = [
        { value: '=', text: 'مساوی' },
        { value: '!=', text: 'نامساوی' }
      ];

      if (this.currentMeta.type === 'boolean') return result;

      if (!this.currentMeta.ref) {
        result.push(...[
          { value: '>', text: 'بیشتر' },
          { value: '<', text: 'کمتر' },
          { value: '~=', text: 'شامل' }
        ]);
      }
      else if (this.currentMeta.timeFormat) {
        result.push({ value: '~=', text: 'شامل' });
      }

      return result;

    },
    valueField() {

      if (!this.currentMeta) return [];

      if (this.currentMeta.ref) {
        return [ { key: 'value', type: 'resource', resource: this.currentMeta.ref, hideDetails: true, dense: true, simple: true, background: 'transparent' } ];
      }
      else if (this.currentMeta.type === 'boolean') {
        return [ { key: 'value', type: 'checkbox', hideDetails: true, title: 'مقدار' } ];
      }
      else {
        return [ { key: 'value', type: 'text', placeholder: 'جستجو', number: this.currentMeta.type === 'number', hideDetails: true, dense: true, simple: true, background: 'transparent' } ];
      }

    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-element > .small-text {
    display: inline-block;
  }
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