<template>
  <y-datetime-selector-field
    :input-class="field.inputClass"
    :input-style="field.inputStyle"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :label-format="field.labelFormat || defaultValueFormat"
    :value-format="field.valueFormat || defaultValueFormat"
    :startup-view="field.startupView"
    :placeholder="field.placeholder"
    :background-color="field.background"
    :dense="field.dense"
    :locale="field.locale || 'fa'"
    :dir="field.dir"
    :disabled-dates="field.disabledDates"
    :color="field.color"
    :dark="field.dark"
    :disabled="field.disabled"
    :max="field.max"
    :min="field.min"
    :readonly="field.readonly"
    :type="field.selectorType"
    :multiple="field.multiple"
    :range="field.range"
    :unfilled="field.unfilled"
    :autofocus="field.autofocus"
    :error="field.error"
    :success="field.success"
    :message="field.message"
    :value="value"
    :epoch="!field.unepoch"
    :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
    @input="handleInput"
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
  mixins: [YFormElementMixin],
  computed: {
    defaultValueFormat() {
      return {
        'fa': 'jYYYY/jMM/jDD',
        'en': 'YYYY/MM/DD'
      }[this.field.locale || 'fa']
    }
  },
  methods: {
    async handleInput(value) {

      this.$emit('input', value);

      if (!this.field.lazy) {
        await this.$nextTick();
        this.validateValue();
      }

    }
  }
}

</script>
