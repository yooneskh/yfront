<template>
  <v-card>

    <v-card-title>
      <v-icon v-if="icon" class="me-4">{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>

    <y-table
      :headers="headers"
      :items="items"
      :actions="actions"
    />

  </v-card>
</template>

<script>
export default {
  name: 'OKDialog',
  props: {
    icon: String,
    title: String,
    headers: Array,
    items: Array,
    actions: Array
  }
}
</script>