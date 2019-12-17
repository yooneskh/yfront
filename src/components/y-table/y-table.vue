<template>
  <v-data-table :headers="datatableHeaders" :items="items">
    <template #item="{ item, index }">
      <tr>

        <td v-for="header in rawHeaders" :key="header.value" :class="header.class">
          <slot :name="`item-${header.key}`" :item="item" :header="header" :data="item[header.value]">
            {{ item[header.value] }}
          </slot>
        </td>

        <td v-if="showActions">
          <v-btn
            v-for="(action, index) in actions"
            :key="action.key"
            text
            :color="action.color"
            :icon="action.icon && !action.title"
            :small="!action.big"
            class="mb-1"
            :class="{'mt-1': index === 0}"
            :to="action.link && action.link(item)"
            @click="$emit(action.key, item)">

            <v-icon small v-if="action.icon">{{ action.icon }}</v-icon>
            {{ action.title }}

          </v-btn>    
        </td>

      </tr>
    </template>
  </v-data-table>
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
    rawHeaders() {

      const headers = this.headers.map(header => ({
        ...header,
        text: header.text,
        value: header.key
      }));

      if (this.actions.length > 0) {
        headers.push();
      }

      return headers;

    },
    datatableHeaders() {
      
      if (this.actions.length === 0) return this.rawHeaders;

      return [
        ...this.rawHeaders,
        {
          text: this.actionTitle,
          value: '__actions',
          align: 'center',
          sortable: false
        }
      ];

    },
    showActions() {
      return this.actions.length > 0;
    }
  }
}
</script>
