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
    :hint="field.hint"
    persistent-hint
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
    :hint="field.hint"
    persistent-hint
    hide-details="auto"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin'

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
  mixins: [YFormElementMixin]
}

</script>
