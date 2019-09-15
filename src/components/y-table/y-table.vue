<template>
  <v-data-table
    class="y-table"
    :headers="headers"
    :items="items"
    hide-default-footer
    :caption="caption"
  />
</template>

<script>
export default {
  name: 'YTable',
  props: {
    headers: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    caption: {
      type: String
    }
  }
}
</script>

<style>
  .y-table {

  }
</style>