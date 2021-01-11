export const YFormElementMixin = {
  mounted() {
    if (this.field.preemptiveValidation) {
      this.validateValue();
    }
    else if (typeof this.value === 'string') {
      if (this.value.length > 0) this.validateValue();
    }
    else if (Array.isArray(this.value)) {
      if (this.value.length > 0) this.validateValue();
    }
    else if (this.value) {
      this.validateValue();
    }
  },
  methods: {
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