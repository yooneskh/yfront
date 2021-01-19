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
        :hide-details="!message && !hint"
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
      :value="formattedValue"
      :input-format="valueFormat"
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
    placeholder: String,
    hideDetails: Boolean,
    autofocus: Boolean,
    unfilled: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    color: String,
    dark: Boolean,
    disabled: Boolean,
    backgroundColor: String,
    error: Boolean,
    success: Boolean,
    message: String,
    hint: String,
    value: {},
    disabledDates: Function,
    startupView: String,
    locale: String,
    max: String,
    min: String,
    readonly: Boolean,
    type: String,
    multiple: Boolean,
    range: Boolean,
    labelFormat: String,
    valueFormat: String,
    epoch: Boolean
  },
  data: () => ({
    menuOpened: false
  }),
  computed: {
    fieldTitle() {
      if (!this.value) return '';
      return moment(this.value, this.epoch ? undefined : this.valueFormat).format(this.labelFormat);
    },
    formattedValue() {
      if (this.epoch) {
        return this.$formatTime(this.value, this.valueFormat);
      }
      else {
        return this.value;
      }
    }
  },
  methods: {
    handleInput(value) {

      if (this.epoch) {
        this.$emit('input', moment(value, this.valueFormat).valueOf());
      }
      else {
        this.$emit('input', value);
      }

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