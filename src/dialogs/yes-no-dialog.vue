<template>
  <v-card>

    <v-card-title>
      {{ title }}
    </v-card-title>

    <v-card-text>
      {{ message || 'آیا از انجام اینکار اطمینان دارید؟' }}
    </v-card-text>

    <v-card-actions :class="{'flex-row-reverse': danger}">
      <v-btn text :color="danger ? 'error' : 'primary'" @click="$emit('resolve', yesValue || true)">{{ yesText || 'بله' }}</v-btn>
      <v-spacer />
      <v-btn text :color="danger ? undefined : 'error'" @click="$emit('resolve', noValue || false)">{{ noText || 'خیر' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'YesNoDialog',
  props: {
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