<template>
  <div style="min-height: 40px;">
    <v-checkbox
      :label="field.title"
      :input-value="value"
      :true-value="true"
      :false-value="false"
      :dir="field.dir"
      :disabled="field.disabled"
      :readonly="field.readonly"
      class="mt-0 pt-0"
      @change="handleChange"
      :style="`position: absolute; top: 50%; transform: translateY(${field.message ? '-50%' : '-70%'});`"
      :error="field.error"
      :success="field.success"
      :messages="field.message"
      :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
      persistent-hint
      :hide-details="!field.message && !field.hint"
    />
  </div>
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementCheckbox',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  methods: {
    handleChange(value) {
      this.$emit('input', !!value);
      setImmediate(() => this.validateValue())
    }
  }
}

</script>
