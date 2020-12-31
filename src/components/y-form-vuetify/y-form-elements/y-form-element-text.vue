<template>
  <v-text-field
    :type="type"
    :value="currentValue"
    :filled="!field.unfilled"
    :solo="field.solo || field.simple"
    :flat="field.flat || field.simple"
    :dense="field.dense"
    v-facade="field.mask"
    :inputmode="inputMode"
    :background-color="field.background"
    @input="handleInput"
    :label="field.title"
    :placeholder="field.placeholder"
    :class="field.classes"
    :pattern="field.pattern"
    :autocomplete="field.autocomplete"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    :hint="field.hint"
    persistent-hint
    :hide-details="!field.message && !field.hint">
    <template v-if="field.password || field.languages" #append>

      <v-icon v-if="field.password && !field.disabled" class="ms-2" @click="revealed = !revealed">
        {{ revealed ? 'mdi-eye-off' : 'mdi-eye' }}
      </v-icon>

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
  </v-text-field>
</template>

<script>

import { facade } from 'vue-input-facade';
import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementText',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  directives: {
    facade
  },
  mixins: [YFormElementMixin],
  data: () => ({
    revealed: false,
    currentLanguage: '',
    currentLanguageChanged: false
  }),
  computed: {
    type() {

      if (this.field.password && !this.revealed) return 'password';
      if (this.field.number) return 'number';

      return 'text';

    },
    inputMode() {

      if (this.field.inputNumeric) return 'numeric';
      if (this.field.inputEmail) return 'email';
      if (this.field.inputTel) return 'tel';
      if (this.field.inputUrl) return 'url';

      return '';

    },
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
    handleInput(text) {
      if (this.currentLanguageChanged) return;

      if (this.field.languages) {
        this.$set(this.value, this.currentLanguage, text);
        this.$emit('input', this.value);
        return;
      }

      this.$emit('input', text);

    }
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep {
    .v-text-field__details {
      margin-bottom: 0 !important;
    }
  }
</style>