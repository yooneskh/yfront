<template>
  <div class="y-form-element-color">
    <label class="mb-1 d-block">{{ field.title }}</label>
    <v-color-picker
      :value="value"
      @update:color="$emit('input', $event.hex)"
      :class="field.classes"
      :flat="field.flat"
      :hide-canvas="!showCanvas"
      :hide-inputs="!showInputs"
      dir="ltr"
      width="100%"
      :hide-mode-switch="!showModeSwitch"
      :show-swatches="showSwatches"
      :swatches="field.swatches"
      :disabled="field.disabled"
      :readonly="field.readonly"
      mode="rgba"
    />
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
    },
    showCanvas: Boolean,
    showInputs: Boolean,
    showModeSwitch: Boolean,
    showSwatches: Boolean
  }
}
</script>
