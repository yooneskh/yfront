<template>
  <v-radio-group
    class="mt-0"
    :label="field.title"
    :hide-details="field.hideDetails"
    :row="field.row"
    :value="(field.getter && field.getter()) || (field.key && target[field.key])"
    @input="handleInput">
    <v-radio
      v-for="item in field.items"
      :key="item.value"
      :label="item.text"
      :value="item.value"
    />
  </v-radio-group>
</template>

<script>
export default {
  name: 'YFormElementRadios',
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
