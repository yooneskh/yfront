<template>
  <v-text-field
    :type="type"
    :value="value"
    :filled="!field.unfilled"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :dense="field.dense"
    v-facade="field.mask"
    :inputmode="inputMode"
    :background-color="field.background"
    @input="$emit('input', $event)"
    :label="field.title"
    :placeholder="field.placeholder"
    :class="field.classes"
    :pattern="field.pattern"
    :autocomplete="field.autocomplete"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    hide-details="auto">
    <template v-if="field.password" #append>
      <v-icon v-if="!field.disabled" @click="revealed = !revealed">{{ revealed ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
    </template>
  </v-text-field>
</template>

<script>

import { facade } from 'vue-input-facade';

export default {
  name: 'YFormElementText',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  directives: {
    facade
  },
  data: () => ({
    revealed: false
  }),
  computed: {
    type() {
      
      if (this.field.password && !this.revealed) return 'password';
      if (this.field.number) return 'number';

      return 'text';

    },
    inputMode() {

      if (this.field.inputNumeric) return 'numeric';
      if (this.field.inputEmail) return 'email';
      if (this.field.inputTel) return 'tel';
      if (this.field.inputUrl) return 'url';

      return '';

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

<style lang="scss" scoped>
  ::v-deep {
    .v-text-field__details {
      margin-bottom: 0 !important;
    }
  }
</style>