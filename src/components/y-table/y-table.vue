<template>
  <v-simple-table style="background: transparent;">
    <thead>
      <tr>
        <th v-for="header in headers" :key="header.key" :class="header.class">{{ header.text }}</th>
        <th v-if="showActions" class="text-center">{{ actionTitle }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item[itemKey]">

        <td v-for="header in headers" :key="header.key" :class="header.class">
          <slot :name="`item-${header.key}`" :item="item" :header="header" :data="item[header.key]">
            {{ item[header.key] }}
          </slot>
        </td>
         
        <td v-if="showActions" class="text-center">
          <v-btn
            v-for="(action, index) in actions"
            :key="action.key"
            text
            :color="action.color"
            :icon="action.icon && !action.title"
            :small="!action.big"
            class="mb-1"
            :class="{'mt-1': index === 0}"
            @click="$emit(action.key, item)">

            <v-icon small v-if="action.icon">{{ action.icon }}</v-icon>
            {{ action.title }}

          </v-btn>    
        </td>
      
      </tr>
    </tbody>
  </v-simple-table>
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
    },
    itemKey: {
      type: String,
      default: '_id'
    },
    actionTitle: {
      type: String,
      default: 'عملیات'
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    showActions() {
      return this.actions.length > 0;
    }
  }
}
</script>

<style>
  .y-table {

  }
</style>