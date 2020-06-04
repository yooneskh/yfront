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
      hide-details="auto"
    />
  </div>
</template>

<script>
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
  mounted() {
    if (this.value !== undefined) this.validateValue();
  },
  methods: {
    handleChange(value) {
      this.$emit('input', !!value);
      setImmediate(() => this.validateValue())
    },
    validateValue() {
      if (!this.field.rules || this.field.rules.length === 0) {
        this.$emit('update:valid', undefined);
        return;
      }

      for (const rule of this.field.rules || []) {
        const result = rule(this.value);
        if (typeof result === 'boolean' && !result || typeof result === 'string') {
          this.$emit('update:valid', result);
          return;
        }
      } this.$emit('update:valid', true);

    }
  }
}
</script>
