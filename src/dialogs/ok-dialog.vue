<template>
  <v-card>

    <v-card-title>
      <v-icon v-if="icon" class="me-4">{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>

    <v-card-text>
      {{ message }}
    </v-card-text>

    <v-card-actions :class="{'flex-row-reverse': danger}">
      <v-btn text :color="danger ? 'error' : undefined" @click="$emit('resolve', typeof value === 'function' ? (value()) : (value || true))">{{ text || 'تایید' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'OKDialog',
  props: {
    icon: String,
    title: String,
    message: String,
    danger: Boolean,
    text: String,
    value: {},
  }
}
</script>