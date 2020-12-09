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
        :value="fieldTitle"
        :dir="dir"
        :style="inputStyle"
        :autofocus="autofocus"
        v-on="!readonly && { ...on, blur: () => $emit('blur') }"
        :error="error"
        :success="success"
        :messages="message"
        :hint="hint"
        persistent-hint
        :hide-details="!field.message"
      />
    </template>
    <persian-date-picker
      inline
      :class="[`type-${type}`]"
      :type="type || 'date'"
      :locale="locale"
      :disable="disabledDates"
      :view="startupView"
      :max="max"
      :min="min"
      :color="color"
      :value="value"
      :input-format="inputFormat"
      :display-format="labelFormat"
      :format="valueFormat"
      @input="handleInput"
    />
  </v-menu>
</template>

<script>

import moment from 'moment-jalaali';

export default {
  name: 'YDateSelectorField',
  components: {
    'persian-date-picker': require('vue-persian-datetime-picker').default
  },
  props: {
    inputClass: String,
    inputStyle: String,
    label: String,
    dir: String,
    labelFormat: String,
    placeholder: String,
    hideDetails: Boolean,
    autofocus: Boolean,
    unfilled: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    locale: String,
    backgroundColor: String,
    value: {},
    disabledDates: Function,
    startupView: String,
    inputFormat: String,
    color: String,
    dark: Boolean,
    disabled: Boolean,
    max: String,
    min: String,
    readonly: Boolean,
    type: String,
    multiple: Boolean,
    range: Boolean,
    valueFormat: String,
    error: Boolean,
    success: Boolean,
    message: String,
    hint: String
  },
  data: () => ({
    menuOpened: false
  }),
  computed: {
    fieldTitle() {
      if (!this.value) return '';
      return moment(this.value, this.inputFormat || this.valueFormat).format(this.labelFormat || this.valueFormat);
    }
  },
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

<style lang="scss" scoped>
  ::v-deep {
    .vpd-input-group {
      display: none;
    }
    .type-date {
      .vpd-actions {
        display: none;
      }
    }
  }
</style>