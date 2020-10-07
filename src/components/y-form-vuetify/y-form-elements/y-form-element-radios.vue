<template>
  <v-radio-group
    class="mt-0"
    :class="{'horizontal': field.horizontal}"
    :label="field.title"
    hide-details="auto"
    :row="field.horizontal"
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    :hint="field.hint"
    persistent-hint
    @change="handleChange"
    style="text-align: unset;">
    <v-radio
      v-for="(item, index) in field.items"
      :key="item.value || item"
      :label="item.text || item"
      :value="item.value || item"
      :dir="field.dir"
      :class="{
        'mt-1': !field.horizontal && index === 0,
        'ms-0 me-3 mb-2': field.horizontal,
        'ms-6': field.horizontal && index === 0,
        [field.itemClass]: !!field.itemClass
      }"
    />
  </v-radio-group>
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementRadios',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  methods: {
    handleChange(value) {
      this.$emit('input', value);
      setImmediate(this.validateValue);
    }
  }
}

</script>

<style lang="scss" scoped>
  ::v-deep.v-input.horizontal legend {
    margin-bottom: 8px !important;
    padding: 0;
  }
</style>