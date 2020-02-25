<template>
  <div class="file-element mb-4">
    <y-file-uploader
      :label="field.title"
      :wrapped="field.wrapped"
      :class="field.classes"
      :value="value"
      @input="$emit('input', $event)"
    />
  </div>
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
