<template>
  <v-card>

    <v-card-title>
      <v-icon v-if="icon" class="me-3">{{ icon }}</v-icon>
      {{ title }}
    </v-card-title>

    <v-card-text>
      {{ message || 'آیا از انجام اینکار اطمینان دارید؟' }}
    </v-card-text>

    <v-card-actions :class="{'flex-row-reverse': danger}">
      <v-btn text :color="danger ? 'error' : 'primary'" @click="$emit('resolve', typeof yesValue === 'function' ? (yesValue()) : (yesValue || true))">{{ yesText || 'بله' }}</v-btn>
      <v-spacer />
      <v-btn text :color="danger ? undefined : 'error'" @click="$emit('resolve', typeof noValue === 'function' ? (noValue()) : (noValue || false))">{{ noText || 'خیر' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'YesNoDialog',
  props: {
    icon: String,
    title: String,
    message: String,
    danger: Boolean,
    yesText: String,
    noText: String,
    yesValue: {},
    noValue: {}
  }
}
</script>