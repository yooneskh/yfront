<template>
  <y-date-selector-field
    :input-class="field.inputClass"
    :input-style="field.inputStyle"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :label-format="field.labelFormat"
    :placeholder="field.placeholder"
    :background-color="field.background"
    :dense="field.dense"
    :locale="field.locale"
    :first-day-of-week="field.firstDayOfWeek"
    :dir="field.dir"
    :value="value"
    :allowed-dates="field.allowedDates"
    :color="field.color"
    :dark="field.dark"
    :disabled="field.disabled"
    :max="field.max"
    :min="field.min"
    :readonly="field.readonly"
    :type="field.type"
    :multiple="field.multiple"
    :range="field.range"
    :seperator="field.seperator"
    :value-format="field.valueFormat"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: 'YFormElementDate',
  components: {
    'y-date-selector-field': require('../../y-date-selector-field').default
  },
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  }
}
</script>
