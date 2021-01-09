<template>
  <v-textarea
    :value="currentValue"
    @input="handleInput"
    :filled="!field.unfilled"
    :label="field.title"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :rows="field.rows"
    :auto-grow="field.autoGrow"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    :hint="typeof field.hint === 'function' ? field.hint(value) : field.hint"
    persistent-hint
    :hide-details="!field.message && !field.hint">
    <template v-if="field.languages" #append>

      <v-menu v-if="field.languages" absolute>
        <template #activator="{ on, attrs }">
          <v-btn rounded small text v-on="on" v-bind="attrs" class="px-2" min-width="0">
            {{ currentLanguage }}
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(value, key) of field.languages" :key="key" @click="changeLanguageTo(key)">
            <v-list-item-content>
              <v-list-item-title>{{ key }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>

    </template>
  </v-textarea>
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementText',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    currentLanguage: '',
    currentLanguageChanged: false
  }),
  computed: {
    currentValue() {
      if (!this.field.languages) return this.value;

      if (!this.value) return '';
      return this.value[this.currentLanguage];

    }
  },
  created() {
    if (this.field.languages) {
      this.currentLanguage = Object.keys(this.field.languages)[0];
      if (!this.value) this.$emit('input', {});
    }
  },
  methods: {
    changeLanguageTo(language) {

      this.currentLanguageChanged = true;
      setTimeout(() => this.currentLanguageChanged = false, 200);

      this.currentLanguage = language;

    },
    async handleInput(text) {
      if (this.currentLanguageChanged) return;

      if (this.field.languages) {
        this.$set(this.value, this.currentLanguage, text);
        this.$emit('input', this.value);
        await this.$nextTick();
        if (!this.field.lazy) this.validateValue();
        return;
      }

      this.$emit('input', text);
      await this.$nextTick();
      if (!this.field.lazy) this.validateValue();

    }
  }
}

</script>
