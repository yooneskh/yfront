<template>
  <y-datetime-selector-field
    :input-class="field.inputClass"
    :input-style="field.inputStyle"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :label-format="field.labelFormat"
    :input-format="field.inputFormat"
    :value-format="field.valueFormat || 'jYYYY/jMM/jDD'"
    :startup-view="field.startupView"
    :placeholder="field.placeholder"
    :background-color="field.background"
    :dense="field.dense"
    :locale="field.locale || 'fa'"
    :dir="field.dir"
    :value="value"
    :disabled-dates="field.disabledDates"
    :color="field.color"
    :dark="field.dark"
    :disabled="field.disabled"
    :max="field.max"
    :min="field.min"
    :readonly="field.readonly"
    :type="field.type"
    :multiple="field.multiple"
    :range="field.range"
    :unfilled="field.unfilled"
    :autofocus="field.autofocus"
    :error="field.error"
    :success="field.success"
    :message="field.message"
    @input="$emit('input', $event)"
    @blur="validateValue"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin'

export default {
  name: 'YFormElementDate',
  components: {
    'y-datetime-selector-field': require('../../y-datetime-selector-field').default
  },
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
