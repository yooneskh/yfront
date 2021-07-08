<template>
  <div class="y-form-element-json">

    <v-textarea
      :value="serializedValue"
      @input="handleInput"
      :filled="!field.unfilled"
      :label="field.title"
      :solo="field.solo || field.simple"
      :flat="field.flat || field.simple"
      :placeholder="field.placeholder"
      :class="field.classes"
      :dir="field.dir || 'ltr'"
      :rows="field.rows || 7"
      :auto-grow="field.autoGrow"
      :disabled="field.disabled"
      :readonly="field.readonly"
      :autofocus="field.autofocus"
      :error="field.error"
      :success="field.success"
      :messages="field.message"
      :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
      persistent-hint
      :hide-details="!field.message && !field.hint"
    />

    <transition name="slide-from-up">
      <v-alert v-if="invalidJson" dark dense color="error" icon="mdi-alert" class="mt-2">
        <span class="text-body-2">شکل JSON صحیح نیست!</span>
      </v-alert>
    </transition>

  </div>
</template>

<script>

import { YFormElementMixin } from 'ykh-form-extended';

export default {
  name: 'YFormElementJson',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    invalidJson: false
  }),
  computed: {
    serializedValue() {
      return JSON.stringify(this.value, undefined, '  ');
    }
  },
  methods: {
    async handleInput(value) {

      this.invalidJson = false;

      try {

        const newValue = JSON.parse(value);

        this.$emit('input', newValue);
        await this.$nextTick();
        this.validateValue();

      }
      catch {
        this.invalidJson = true;
      }

    }
  }
};

</script>

<style lang="scss">
  .y-form-element-json textarea {
    font-family: monospace !important;
    font-size: 12px !important;
    line-height: 20px !important;
  }
</style>
