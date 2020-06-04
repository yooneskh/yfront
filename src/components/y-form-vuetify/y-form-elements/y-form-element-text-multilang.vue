<template>
  <v-text-field
    type="text"
    :filled="!field.unfilled"
    :value="value[currentLanguage]"
    @input="$set(value, currentLanguage, $event); $emit('input', value)"
    :label="field.title"
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir"
    :disabled="field.disabled"
    :readonly="field.readonly"
    :autofocus="field.autofocus"
    @blur="validateValue"
    :error="field.error"
    :success="field.success"
    :messages="field.message"
    hide-details="auto">
    <template #append>
      <v-menu>
        <template #activator="{ on }">
          <v-btn text v-on="on">{{ currentLanguage }}</v-btn>
        </template>
        <v-list dense>
          <v-list-item v-for="(config, language) in field.languages" :key="language" @click="currentLanguage = language">
            <v-list-item-title class="text-center">{{ language.toUpperCase() }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script>
export default {
  name: 'YFormElementTextMultilang',
  props: {
    value: {
      default: () => ({})
    },
    field: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    currentLanguage: ''
  }),
  created() {
    this.currentLanguage = Object.keys(this.field.languages)[0];
  },
  mounted() {
    if (this.value !== undefined) this.validateValue();
  },
  methods: {
    validateValue() {
      if (!this.field.rules || this.field.rules.length === 0) {
        this.$emit('update:valid', undefined);
        return;
      }

      for (const rule of this.field.rules || []) {
        const result = rule(this.value);
        if (typeof result === 'boolean' && !result || typeof result === 'string') {
          this.$emit('update:valid', result);
          return;
        }
      } this.$emit('update:valid', true);

    }
  }
}
</script>
