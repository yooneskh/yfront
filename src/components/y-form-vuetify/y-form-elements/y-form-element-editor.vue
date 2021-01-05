<template>
  <div class="y-form-element-editor">

    <v-label>{{ field.title }}</v-label>

    <v-btn depressed class="mt-2" color="primary" :disabled="field.disabled" block @click="windowOpened = true">
      باز کردن ویرایشگر
    </v-btn>

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

    <div class="global-window grey lighten-4 py-2 px-2" v-if="windowOpened" style="overflow-y: auto;">

      <v-toolbar class="mb-8">
        <v-toolbar-title>ویرایشگر</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>

          <v-menu v-if="field.languages" absolute>
            <template #activator="{ on, attrs }">
              <v-btn text v-on="on" v-bind="attrs">
                {{ currentLanguage }}
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(value, key) of field.languages" :key="key" @click="changeLanguageTo(key)">
                <v-list-item-content>
                  <v-list-item-title>{{ key }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn icon @click="windowOpened = false; validateValue()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <y-rich-editor
        :value="currentValue"
        @input="handleInput"
        :placeholder="field.placeholder"
        :class="field.classes"
        :readonly="field.readonly"
        class="mb-10"
        style="width: 100%; max-width: 800px; margin: 0 auto;"
      />

    </div>

  </div>
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin'

export default {
  name: 'YFormElementEditor',
  components: {
    'y-rich-editor': require('../../y-rich-editor').default
  },
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    windowOpened: false,
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
  .global-window {
    position: fixed;
    top: 0; left: 0; bottom: 0; right: 0;
    z-index: 1;
    background: grey;
  }
</style>