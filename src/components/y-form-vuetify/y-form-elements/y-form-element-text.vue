<template>
  <v-text-field
    :type="field.password ? 'password' : 'text'"
    :value="(field.getter && field.getter()) || (field.key && target[field.key])"
    @input="handleInput"
    :label="field.title"
    :class="field.classes"
    :dir="field.dir"
    :hide-details="field.hideDetails" />
</template>

<script>
export default {
  name: 'YFormElementText',
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
    handleInput(text) {

      const value = this.field.number ? parseInt(text, this.field.radix || 10) : text;

      if (this.field.setter) {
        this.field.setter(value);
      }
      else {
        this.$set(this.target, this.field.key, value);
      }

    }
  }
}
</script>
