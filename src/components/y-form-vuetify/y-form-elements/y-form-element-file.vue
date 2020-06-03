<template>
  <y-file-uploader
    :label="field.title"
    :wrapped="field.wrapped"
    :class="field.classes"
    :unfilled="field.unfilled"
    :value="value"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @input="$emit('input', $event)"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :message="field.message"
  />
</template>

<script>
export default {
  name: 'YFormElementFile',
  components: {
    'y-file-uploader': require('../../y-file-uploader.vue').default
  },
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
    validateValue() {
      if (!this.field.rules || this.field.rules.length === 0) {
        this.$emit('validate', undefined);
        return;
      }

      for (const rule of this.field.rules || []) {
        const result = rule(this.field.wrapped ? this.value?._id : this.value);
        if (typeof result === 'boolean' && !result || typeof result === 'string') {
          this.$emit('validate', result);
          return;
        }
      } this.$emit('validate', true);

    }
  }
}
</script>
