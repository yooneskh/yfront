<template>
  <v-card>

    <v-card-title class="headline" primary-title>
      {{ title || 'انتخاب مورد' }}
    </v-card-title>

    <v-card-text class="pb-1">
      یکی از موارد زیر را انتخاب کنید.
    </v-card-text>

    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(item, index) in items" :key="item.value || index" @click="$emit('resolve', item.value || item)">
          <v-list-item-icon v-if="item.icon">
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-html="item.text || item.value || item" />
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
    title: String,
    items: Array
  }
}
</script>
