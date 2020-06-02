<template>
  <v-select
    v-if="!field.addable"
    :filled="!field.unfilled"
    :label="field.title"
    :items="field.items"
    :multiple="field.multiple"
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @input="$emit('input', $event)"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    hide-details="auto"
  />
  <v-combobox
    v-else
    filled
    :label="field.title"
    :items="field.items"
    chips deletable-chips small-chips
    :multiple="field.multiple"
    :value="value"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @input="$emit('input', $event)" 
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    hide-details="auto"
  />
</template>

<script>
export default {
  name: 'YFormElementSelect',
  props: {
    value: {

    },
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
