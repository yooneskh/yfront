<template>
  <v-checkbox v-model="target[field.key]" :label="field.title" />
</template>

<script>
export default {
  name: 'YFormElementCheckbox',
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
