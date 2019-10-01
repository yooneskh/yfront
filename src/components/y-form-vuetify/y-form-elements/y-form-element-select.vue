<template>
  <v-select
    v-if="!field.addable"
    :label="field.title"
    :items="field.items"
    :hide-details="field.hideDetails"
    :multiple="field.multiple"
    :value="(field.getter && field.getter()) || (field.key && target[field.key])"
    @input="handleInput"
  />
  <v-combobox
    v-else
    :label="field.title"
    :items="field.items"
    chips
    deletable-chips
    small-chips
    :multiple="field.multiple"
    :value="(field.getter && field.getter()) || (field.key && target[field.key])"
    @input="handleInput" 
  />
</template>

<script>
export default {
  name: 'YFormElementSelect',
  props: {
    target: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleInput(value) {
      if (this.field.setter) {
        this.field.setter(value);
      }
      else {
        this.target[this.field.key] = value;
      }
    }
  }
}
</script>
