<template>
  <v-checkbox
    :label="field.title"
    :input-value="value"
    :true-value="true"
    :false-value="false"
    :hide-details="field.hideDetails"
    @change="$emit('input', !!$event)"
  />
</template>

<script>
export default {
  name: 'YFormElementCheckbox',
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
