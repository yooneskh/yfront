<template>
  <div class="filter-element">

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      :items="metas.map(meta => ({ value: meta.key, text: meta.title || meta.key }))"
      :value="value.key"
      @input="changeValue('key', $event)"
      style="width: 110px;"
    />

    <v-select
      v-if="currentMeta && currentMeta.variants"
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      :items="Object.keys(currentMeta.variants)"
      :value="value.modifier"
      @input="changeValue('modifier', $event)"
      style="width: 60px;"
    />

    <v-select
      class="small-text"
      dense solo flat hide-details
      background-color="transparent"
      :items="currentOperators"
      :value="value.operator"
      @input="changeValue('operator', $event)"
      style="width: 90px;"
    />

    <y-form
      class="small-text"
      :target="value"
      :fields="valueField"
      no-bottom-padding
      style="width: 110px;"
    />

  </div>
</template>

<script>
import { resourceFilterNextConfig } from './y-resource-util';
export default {
  name: 'YResourceFilterElement',
  props: {
    metas: Array,
    value: Object
  },
  computed: {
    currentMeta() {
      return this.metas.find(meta => meta.key === this.value.key);
    },
    currentOperators() {

      const result = [
        { value: '=', text: 'مساوی' },
        { value: '!=', text: 'نامساوی' }
      ];

      if (this.currentMeta.type === 'boolean') return result;

      if (!this.currentMeta.ref) {
        result.push(
          { value: '>', text: 'بیشتر' },
          { value: '<', text: 'کمتر' },
          { value: '~=', text: 'شامل' }
        );
      }
      else if (this.currentMeta.labelFormat) {
        result.push({ value: '~=', text: 'شامل' });
      }

      return result;

    },
    valueField() {
      if (!this.currentMeta) return [];

      if (this.currentMeta.ref) {
        return [ { key: 'value', type: 'resource', resource: this.currentMeta.ref, dense: true, simple: true, background: 'transparent', unfilled: true } ];
      }
      else if (this.currentMeta.type === 'boolean') {
        return [ { key: 'value', type: 'checkbox', title: 'مقدار' } ];
      }
      else {
        return [ { key: 'value', type: 'text', placeholder: 'جستجو', number: this.currentMeta.type === 'number', dense: true, simple: true, background: 'transparent', unfilled: true } ];
      }

    }
  },
  methods: {
    changeValue(key, value) {

      const changes = { [key]: value };

      if (key === 'key') {
        Object.assign(
          changes,
          resourceFilterNextConfig(this.metas.find(it => it.key === value))
        );
      }

      this.$emit('input', { ...this.value, ...changes });

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