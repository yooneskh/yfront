<template>
  <v-textarea
    :value="value"
    @input="$emit('input', $event)"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :rows="field.rows"
    :auto-grow="field.autoGrow"
    :hide-details="field.hideDetails" />
</template>

<script>
export default {
  name: 'YFormElementTexts',
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
