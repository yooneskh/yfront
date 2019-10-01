<template>
  <v-checkbox
    :label="field.title"
    :value="(field.getter && field.getter()) || (field.key && target[field.key])"
    @input="handleInput"
  />
</template>

<script>
export default {
  name: 'YFormElementCheckbox',
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
