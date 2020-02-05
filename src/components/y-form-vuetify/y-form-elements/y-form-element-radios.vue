<template>
  <v-radio-group
    class="mt-0"
    :label="field.title"
    :hide-details="field.hideDetails"
    :row="field.row"
    :value="value"
    @change="$emit('input', $event)"
    style="text-align: unset;">
    <v-radio
      v-for="item in field.items"
      :key="item.value"
      :label="item.text"
      :value="item.value"
      :class="{'ms-2': !field.row}"
    />
  </v-radio-group>
</template>

<script>
export default {
  name: 'YFormElementRadios',
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  }
}
</script>
