<template>
  <v-select
    v-if="!field.addable"
    :filled="!field.unfilled"
    :label="field.title"
    :items="field.items"
    hide-details
    :multiple="field.multiple"
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    @input="$emit('input', $event)"
  />
  <v-combobox
    v-else
    filled
    :label="field.title"
    :items="field.items"
    chips deletable-chips small-chips
    :multiple="field.multiple"
    hide-details
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    @input="$emit('input', $event)" 
  />
</template>

<script>
export default {
  name: 'YFormElementSelect',
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
