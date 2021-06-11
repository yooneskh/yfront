<template>
  <v-data-table
    class="no-wrap"
    :headers="datatableHeaders"
    @update:options="handleSort"
    :sort-by="Object.keys(sorts)[0]"
    :sort-desc="Object.values(sorts)[0] === -1"
    :items="items"
    :server-items-length="serverItemsLength"
    :caption="caption"
    :itemid="itemKey"
    :footer-props="{
      itemsPerPageOptions
    }"
    @update:page="$emit('update:page', $event)"
    :items-per-page="itemsPerPage"
    @update:items-per-page="$emit('update:items-per-page', $event)">
    <template #item="{ item }">
      <tr :key="item[itemKey]">

        <td v-for="header in rawHeaders" :key="header.value" :class="header.class">
          <span class="d-inline-block" :class="header.itemClass">
            <slot :name="`item-${header.key}`" :item="item" :header="header" :data="item[header.value]">
              {{ item[header.value] }}
            </slot>
          </span>
        </td>

        <td v-if="showActions" class="text-center" style="white-space: nowrap;">
          <v-tooltip v-for="(action, index) in permittedActions.filter(it => !it.vIf || it.vIf(item))" :key="action.key" :disabled="!action.tooltip || $isMobile" fixed top>
            <template #activator="{ on }">
              <v-btn
                text
                :color="action.color"
                :icon="action.icon && !(!!action.title || ($isMobile && !!action.tooltip))"
                :rounded="action.icon && (!!action.title || ($isMobile && !!action.tooltip))"
                :small="!action.large"
                class="mb-1 me-1"
                :class="{'mt-1': index === 0}"
                v-on="on"
                :to="action.link && !action.link(item).startsWith('http') ? action.link(item) : undefined"
                :href="action.link && action.link(item).startsWith('http') ? action.link(item) : undefined" :target="action.newPage ? '_blank' : undefined"
                @click="$emit(action.key, item)">

                <v-icon v-if="action.icon" :small="!action.large" :left="(!!action.title || ($isMobile && !!action.tooltip))">{{ action.icon }}</v-icon>
                {{ (action.title || ($isMobile ? action.tooltip : undefined)) }}

              </v-btn>
            </template>
            <span>{{ action.tooltip }}</span>
          </v-tooltip>
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
    serverItemsLength: {
      type: Number
    },
    itemsPerPage: {
      type: Number,
      default: 5
    },
    actions: {
      type: Array,
      default: () => []
    },
    sorts: {
      type: Object,
      default: () => ({})
    },
    itemsPerPageOptions: {
      type: Array
    }
  },
  computed: {
    permittedActions() {
      return (this.actions || []).filter(it => {
        if (it.permissions) return this.$hasAccesses(it.permissions);
        if (it.anyPermissions) return it.anyPermissions.some(p => this.$hasAccesses([p]));
        return true;
      });
    },
    showActions() {
      return this.permittedActions.length > 0;
    },
    rawHeaders() {

      const headers = this.headers.map(header => ({
        ...header,
        text: header.text,
        value: header.key
      }));

      if (this.showActions) headers.push();

      return headers;

    },
    datatableHeaders() {
      if (!this.showActions) return this.rawHeaders;

      return [
        ...this.rawHeaders,
        {
          text: this.actionTitle,
          value: '__actions',
          align: 'center',
          sortable: false
        }
      ];

    }
  },
  methods: {
    async handleSort(options) {

      const { sortBy: [ sortBy ], sortDesc: [ sortDesc ] } = options;

      if (!sortBy) {
        if (JSON.stringify(this.sorts) === '{}') return;
        return this.$emit('update:sorts', {});
      }

      const newSort = { [sortBy]: sortDesc ? -1 : 1 };
      if (JSON.stringify(newSort) === JSON.stringify(this.sorts)) return;

      this.$emit('update:sorts', newSort);

    }
  }
}
</script>

<style lang="scss">
  .v-data-table.no-wrap {
    th {
      white-space: nowrap;
    }
  }
</style>