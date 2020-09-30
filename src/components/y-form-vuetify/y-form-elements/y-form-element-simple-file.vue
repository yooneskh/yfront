<template>
  <v-file-input
    :value="value"
    :filled="!field.unfilled"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :dense="field.dense"
    :background-color="field.background"
    @change="$emit('input', $event)"
    :label="field.title"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    :hint="field.hint"
    prepend-icon=""
    prepend-inner-icon="mdi-paperclip"
    hide-details="auto"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementSimpleFile',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin]
}
</script>
