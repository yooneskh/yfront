<template>
  <v-select
    v-if="!field.addable"
    v-model="target[field.key]"
    :label="field.title"
    :items="field.items"
    :multiple="field.multiple"
  />
  <v-combobox
    v-else
    v-model="target[field.key]"
    :label="field.title"
    :items="field.items"
    chips
    deletable-chips
    small-chips
    :multiple="field.multiple"
  />
</template>

<script>
export default {
  name: 'YFormElementSelect',
  props: {
    target: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    }
  }
}
</script>
