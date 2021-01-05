<template>
  <y-time-selector-field
    :input-class="field.inputClass"
    :input-style="field.inputStyle"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :placeholder="field.placeholder"
    :background-color="field.background"
    :dense="field.dense"
    :dir="field.dir"
    :value="value"
    :color="field.color"
    :dark="field.dark"
    :ligh="field.ligh"
    :disabled="field.disabled"
    :max="field.max"
    :min="field.min"
    :readonly="field.readonly"
    :unfilled="field.unfilled"
    :autofocus="field.autofocus"
    :error="field.error"
    :success="field.success"
    :message="field.message"
    :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
    :allowed-hours="field.allowedHours"
    :allowed-minutes="field.allowedMinutes"
    :allowed-seconds="field.allowedSeconds"
    :format="field.format"
    :header-color="field.headerColor"
    :landscape="field.landscape"
    :no-title="field.noTitle"
    :use-seconds="field.useSeconds"
    :width="field.clockWidth"
    @input="$emit('input', $event)"
    @blur="validateValue"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin'

export default {
  name: 'YFormElementTime',
  components: {
    'y-time-selector-field': require('../../y-time-selector-field').default
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
