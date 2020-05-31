<template>
  <y-file-uploader
    :label="field.title"
    :wrapped="field.wrapped"
    :class="field.classes"
    :unfilled="field.unfilled"
    :value="value"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'YFormElementFile',
  components: {
    'y-file-uploader': require('../../y-file-uploader.vue').default
  },
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
