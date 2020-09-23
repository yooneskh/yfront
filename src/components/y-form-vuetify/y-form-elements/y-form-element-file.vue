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
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :message="field.message"
    :hint="field.hint"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin'

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
  },
  mixins: [YFormElementMixin]
}

</script>
