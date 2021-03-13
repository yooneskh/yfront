<template>
  <v-card>

    <v-card-title>
      <v-icon v-if="icon" class="me-4">{{ icon }}</v-icon>
      {{ title || 'انتخاب مورد' }}
    </v-card-title>

    <v-card-text v-if="!readonly" class="pb-1">
      یکی از موارد زیر را انتخاب کنید.
    </v-card-text>

    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in items" :key="item.value || index" @click="!readonly ? $emit('resolve', item.value || item) : undefined">
          <v-list-item-icon v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.text || item.value || item }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle">{{ item.subtitle }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

  </v-card>
</template>

<script>
export default {
  name: 'ListPickerDialog',
  props: {
    icon: String,
    title: String,
    items: Array,
    readonly: Boolean
  }
}
</script>
