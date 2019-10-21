<template>
  <v-select
    v-if="!field.addable"
    :label="field.title"
    :items="field.items"
    :hide-details="field.hideDetails"
    :multiple="field.multiple"
    :value="value"
    @input="$emit('input', $event)"
  />
  <v-combobox
    v-else
    :label="field.title"
    :items="field.items"
    chips
    deletable-chips
    small-chips
    :multiple="field.multiple"
    :value="value"
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
