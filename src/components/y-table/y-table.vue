<template>
  <v-data-table
    class="no-wrap"
    :headers="datatableHeaders"
    @update:options="handleSort"
    :sort-by="sortBy"
    :sort-desc="sortDesc"
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
          <v-tooltip v-for="(action, index) in actions.filter(it => !it.vIf || it.vIf(item))" :key="action.key" :disabled="!action.tooltip || $isMobile" fixed top>
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
  data: () => ({
    sortBy: '',
    sortDesc: ''
  }),
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
  },
  watch: {
    sorts: {
      deep: true,
      immediate: true,
      handler() {

        const sortKey = Object.keys(this.sorts)[0];

        if (sortKey) {
          this.sortBy = sortKey;
          this.sortDesc = this.sorts[sortKey] === -1;
        }
        else {
          this.sortBy = undefined;
          this.sortDesc = false;
        }

      }
    }
  },
  methods: {
    handleSort(options) {

      const t = (options.sortBy || []).concat(options.sortDesc || []);
      let tt = {};

      if (options.sortBy?.[0]) tt = {[t[0]]: 1};
      if (options.sortDesc?.[0]) tt = {[t[0]]: -1};

      this.$emit('update:sorts', tt);

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