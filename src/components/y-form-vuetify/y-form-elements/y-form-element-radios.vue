<template>
  <v-radio-group
    class="mt-0"
    :class="{'horizontal': field.horizontal}"
    :label="field.title"
    hide-details
    :row="field.horizontal"
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    @change="$emit('input', $event)"
    style="text-align: unset;">
    <v-radio
      v-for="(item, index) in field.items"
      :key="item.value"
      :label="item.text"
      :value="item.value"
      :dir="field.dir"
      :class="{'mt-1': !field.horizontal && index === 0, 'ms-0 me-3 mb-2': field.horizontal, 'ms-6': field.horizontal && index === 0}"
    />
  </v-radio-group>
</template>

<script>
export default {
  name: 'YFormElementRadios',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
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