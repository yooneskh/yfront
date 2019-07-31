<template>
  <v-select v-model="target[field.key]" :label="field.title" :items="field.items" :multiple="field.multiple" />
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
