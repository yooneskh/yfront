<template>
  <v-radio-group class="mt-0" v-model="target[field.key]" :label="field.title" :hide-details="field.noDetails" :row="field.row">
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
  }
}
</script>
