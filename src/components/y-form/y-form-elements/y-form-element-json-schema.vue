<template>
  <div class="y-form-element-json-schema">

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <div class="y-json-schema-container pa-2 mt-1">
      <y-json-schema-element
        v-if="value"
        :value="value"
        is-root
        @input="handleInput"
      />
    </div>

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>

import YJsonSchemaElement from './components/json-schema/y-json-schema-element.vue';

import { YFormElementMixin } from 'ykh-form-extended';

export default {
  name: 'YFormElementJsonSchema',
  components: {
    'y-json-schema-element': YJsonSchemaElement
  },
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  created() {
    if (!this.value) {
      this.handleInput({
        key: 'root',
        type: 'object'
      })
    }
  },
  methods: {
    async handleInput(value) {
      this.$emit('input', value);
      await this.$nextTick();
      this.validateValue();
    }
  }
};

</script>

<style lang="scss" scoped>
  .y-json-schema-container {
    border: 1px solid rgba(black, 0.15);
    background-color: rgba(black, 0.0175);
    border-radius: 4px;
  }
</style>
