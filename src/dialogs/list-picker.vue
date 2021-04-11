<template>
  <v-card>

    <v-card-title>
      <v-icon v-if="icon" class="me-4">{{ icon }}</v-icon>
      {{ title || 'انتخاب مورد' }}
    </v-card-title>

    <v-card-text v-if="!readonly" class="pb-1">
      {{ body || 'یکی از موارد زیر را انتخاب کنید.' }}
    </v-card-text>

    <v-list :nav="navigation">
      <v-list-item-group color="primary">
        <v-list-item v-for="(item, index) in items" :key="item.value === undefined ? index : item.value" :class="[item.itemClass]" @click="!readonly ? $emit('resolve', item.value || item) : undefined">
          <v-list-item-icon v-if="item.icon">
            <v-icon :color="item.color">{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-icon v-if="item.iconPath">
            <img :src="item.iconPath" style="height: 24px;" />
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title :class="[item.color ? `${item.color}--text` : undefined]">{{ item.text || item.value || item }}</v-list-item-title>
            <v-list-item-subtitle v-if="item.subtitle" :class="[item.color ? `${item.color}--text` : undefined]">{{ item.subtitle }}</v-list-item-subtitle>
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
    body: String,
    items: Array,
    readonly: Boolean,
    navigation: Boolean
  }
}
</script>
