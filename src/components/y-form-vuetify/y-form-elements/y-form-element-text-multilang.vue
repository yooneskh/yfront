<template>
  <v-text-field
    type="text"
    filled
    :value="value[currentLanguage]"
    @input="$set(value, currentLanguage, $event); $emit('input', value)"
    :label="field.title"
    hide-details
    :placeholder="field.placeholder"
    :class="field.classes"
    :dir="field.dir">
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
  }
}
</script>
