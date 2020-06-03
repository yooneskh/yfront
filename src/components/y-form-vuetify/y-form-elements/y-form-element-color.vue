<template>
  <div class="y-form-element-color">

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <v-color-picker
      :value="value"
      @update:color="handleChange"
      :class="field.classes"
      :flat="field.flat"
      :hide-canvas="!field.showCanvas"
      :hide-inputs="!field.showInputs"
      :hide-mode-switch="!field.showModeSwitch"
      :show-swatches="field.showSwatches"
      :swatches="field.swatches"
      :disabled="field.disabled"
      :readonly="field.readonly"
      width="100%"
      mode="rgba"
      class="mt-1"
    />

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>
export default {
  name: 'YFormElementColor',
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
      this.$emit('input', value.hex);
      setImmediate(this.validateValue);
    },
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
