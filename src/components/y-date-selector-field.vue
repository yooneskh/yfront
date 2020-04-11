<template>
  <v-menu :close-on-content-click="!multiple && !range" absolute>
    <template #activator="{ on }">
      <v-text-field
        readonly
        :filled="!unfilled"
        :class="inputClass"
        :label="label"
        :placeholder="placeholder"
        hide-details
        :dense="dense"
        :solo="solo"
        :flat="flat"
        :disabled="disabled"
        :background-color="backgroundColor"
        :value="fieldTitle"
        :dir="dir"
        :style="inputStyle"
        v-on="on"
      />
    </template>
    <v-date-picker
      :locale="locale"
      :first-day-of-week="firstDayOfWeek"
      :value="mappedValue"
      no-title
      :allowed-dates="allowedDates"
      :color="color"
      :dark="dark"
      :disabled="disabled"
      :max="max"
      :min="min"
      :multiple="multiple"
      :range="range"
      :readonly="readonly"
      :type="type"
      @change="handleChange"
      @input="handleInput"
    />
  </v-menu>
</template>

<script>

import moment from 'moment-jalaali';

export default {
  name: 'YDateSelectorField',
  props: {
    inputClass: String,
    inputStyle: String,
    label: String,
    dir: String,
    labelFormat: String,
    placeholder: String,
    hideDetails: Boolean,
    unfilled: Boolean,
    dense: Boolean,
    solo: Boolean,
    flat: Boolean,
    locale: String,
    backgroundColor: String,
    firstDayOfWeek: Number,
    value: {},
    allowedDates: Function,
    color: String,
    dark: Boolean,
    disabled: Boolean,
    max: String,
    min: String,
    readonly: Boolean,
    type: String,
    multiple: Boolean,
    range: Boolean,
    seperator: {
      type: String,
      default: ' - '
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD'
    }
  },
  computed: {
    insideValueFormat() {
      return this.type === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD';
    },
    mappedValue() {
      if (!this.value || this.value.length === 0) return (this.multiple || this.range) ? [] : undefined;

      if (this.multiple || this.range) {
        return this.value.map(time => moment(time, this.valueFormat).format(this.insideValueFormat));
      }
      else {
        return moment(this.value, this.valueFormat).format(this.insideValueFormat);
      }

    },
    fieldTitle() {
      if (!this.value || this.value.length === 0) return undefined;
      
      if (this.multiple) {
        return this.value.map(time => moment(time, this.valueFormat).format(this.labelFormat)).join(this.seperator);
      }
      if (this.range) {
        return (this.value[0] ? moment(this.value[0], this.valueFormat).format(this.labelFormat) : '---') + this.seperator + (this.value[1] ? moment(this.value[1], this.valueFormat).format(this.labelFormat) : '---');
      }
      else {
        return moment(this.value, this.valueFormat).format(this.labelFormat);
      }

    }
  },
  methods: {
    handleChange(time) {
      if (this.multiple || this.range) return;

      this.$emit('input', moment(time, this.insideValueFormat).format(this.valueFormat));

    },
    handleInput(times) {
      if (!this.multiple && !this.range) return;

      this.$emit('input', times.map(time => moment(time, this.insideValueFormat).format(this.valueFormat)));
      
    }
  }
}

</script>