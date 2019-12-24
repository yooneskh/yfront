<template>
  <v-text-field
    :type="field.password ? 'password' : (field.number ? 'number' : 'text')"
    :value="value"
    @input="$emit('input', $event)"
    :label="field.title"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :hide-details="field.hideDetails" />
</template>

<script>
export default {
  name: 'YFormElementText',
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
