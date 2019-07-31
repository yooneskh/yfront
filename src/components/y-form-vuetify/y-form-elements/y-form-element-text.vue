<template>
  <v-text-field v-model="target[field.key]" :label="field.title" />
</template>

<script>
export default {
  name: 'YFormElementText',
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
