<template>
  <v-menu :close-on-content-click="false" absolute v-model="menuOpened">
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
        :hint="hint"
        persistent-hint
        :hide-details="!message && !hint"
      />
    </template>
    <v-time-picker
      :allowed-hours="allowedHours"
      :allowed-minutes="allowedMinutes"
      :allowed-seconds="allowedSeconds"
      :color="color"
      :dark="dark"
      :light="light"
      flat
      :format="format || '24hr'"
      :header-color="headerColor"
      :landscape="landscape"
      :max="max"
      :min="min"
      :no-title="noTitle"
      :use-seconds="useSeconds"
      :width="width"
      :value="value"
      @input="handleInput"
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
    dir: String,
    placeholder: String,
    autofocus: Boolean,
    unfilled: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    backgroundColor: String,
    value: {},
    color: String,
    disabled: Boolean,
    max: String,
    min: String,
    readonly: Boolean,
    error: Boolean,
    success: Boolean,
    message: String,
    hint: String,
    allowedHours: {},
    allowedMinutes: {},
    allowedSeconds: {},
    dark: Boolean,
    light: Boolean,
    format: String,
    headerColor: String,
    landscape: Boolean,
    noTitle: Boolean,
    useSeconds: Boolean,
    width: {},
  },
  data: () => ({
    menuOpened: false
  }),
  methods: {
    handleInput(value) {
      this.$emit('input', value);
      setImmediate(() => {
        this.$emit('blur');
        this.menuOpened = false;
      });
    }
  }
}

</script>
