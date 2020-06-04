<template>
  <div class="y-form-element-checkboxes">

    <span class="d-inline-block" :style="field.horizontal ? 'position: relative; bottom: 6px !important;' : ''">
      <v-label>{{ field.title }}</v-label>
    </span>

    <v-checkbox
      v-for="(item, index) in field.items"
      :key="item.value"
      hide-details
      :label="item.text"
      :value="item.value"
      :dir="field.dir"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :error="field.error"
      :success="field.success"
      class="mt-0"
      :class="{
        'mt-2': index === 0 && !field.horizontal,
        'mt-1': index !== 0 && !field.horizontal,
        'd-inline-block me-3 mb-2': field.horizontal,
        'ms-6': field.horizontal && index === 0
      }"
      @change="handleChange($event, item)"
    />

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementCheckboxes',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  methods: {
    handleChange(value, item) {
      this.$emit('input', value, item.value);
      setImmediate(this.validateValue);
    }
  }
}

</script>
