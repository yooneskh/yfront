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
    :unfilled="field.unfilled"
    :autofocus="field.autofocus"
    :value-format="field.valueFormat"
    :error="field.error"
    :success="field.success"
    :message="field.message"
    @input="$emit('input', $event)"
    @blur="validateValue"
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
  },
  methods: {
    validateValue() {
      if (!this.field.rules || this.field.rules.length === 0) {
        this.$emit('validate', undefined);
        return;
      }

      for (const rule of this.field.rules || []) {
        const result = rule(this.value);
        if (typeof result === 'boolean' && !result || typeof result === 'string') {
          this.$emit('validate', result);
          return;
        }
      } this.$emit('validate', true);

    }
  }
}
</script>
