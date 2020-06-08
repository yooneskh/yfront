<template>
  <v-menu :close-on-content-click="false" absolute>
    <template #activator="{ on }">
      <v-text-field
        readonly
        :filled="!unfilled"
        :class="inputClass"
        :label="label"
        :placeholder="placeholder"
        :dense="dense"
        :solo="solo"
        :flat="flat"
        :disabled="disabled"
        :background-color="backgroundColor"
        :value="value"
        :dir="dir"
        :style="inputStyle"
        :autofocus="autofocus"
        v-on="!readonly && { ...on, blur: () => $emit('blur') }"
        :error="error"
        :success="success"
        :messages="message"
        hide-details="auto"
      />
    </template>
    <v-time-picker
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
      :allowed-seconds="allowedSeconds"
      :color="color"
      :dark="dark"
      format="24hr"
      :use-seconds="useSeconds"
      :value="value"
      @change="$emit('input', $event)"
    />
  </v-menu>
</template>

<script>
export default {
  name: 'YTimeSelectorField',
  props: {
    inputClass: String,
    inputStyle: String,
    label: String,
    solo: Boolean,
    flat: Boolean,
    placeholder: String,
    backgroundColor: String,
    dense: Boolean,
    dir: String,
    value: String,
    color: String,
    dark: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    unfilled: Boolean,
    autofocus: Boolean,
    error: Boolean,
    success: Boolean,
    message: String,
    allowedHours: Array,
    allowedMinutes: Array,
    allowedSeconds: Array,
    useSeconds: Boolean,
  }
}

</script>