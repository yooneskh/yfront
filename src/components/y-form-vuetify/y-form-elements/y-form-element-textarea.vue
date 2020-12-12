<template>
  <v-textarea
    :value="value"
    @input="$emit('input', $event)"
    :filled="!field.unfilled"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :rows="field.rows"
    :auto-grow="field.autoGrow"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    :hint="field.hint"
    persistent-hint
    :hide-details="!field.message && !field.hint"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementText',
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
