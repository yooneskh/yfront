<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title v-if="title" class="pe-3">
        {{ title }}
        <v-spacer />
        <v-btn text color="primary" @click="initEditor(undefined)">
          افزودن
          <v-icon right>mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <y-resource-filter v-model="filters" :metas="metas.list" />

      <y-table
        :headers="headers"
        :items="resources.list"
        :actions="[
          { key: 'edit', icon: 'mdi-pen' },
          { key: 'delete', icon: 'mdi-delete', color: 'error' }
        ]"
        :loading="loading"
        :server-items-length="resources.allCount"
        @update:page="page = $event"
        :items-per-page="itemsPerPage"
        @update:items-per-page="itemsPerPage = $event"
        :sorts.sync="sorts"
        @edit="initEditor"
        @delete="deleteResource">
        <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ header, data }">
          <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
        </template>
      </y-table>

    </v-card>
  </div>
</template>

<script>

import YNetwork from 'ynetwork';
import debounce from 'lodash/debounce';
import { loadMetasFor, transformFilters, transformSorts } from './y-resource-util';

export default {
  name: 'YResourceManager',
  components: {
    'y-resource-table-cell': require('./y-resource-table-cell').default,
    'y-resource-filter': require('./y-resource-filter').default
  },
  props: {
    title: {
      type: String
    },
    modelName: {
      type: String,
      required: true
    },
    sortLatest: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    loading: false,
    metas: {
      list: []
    },
    resources: {
      list: [],
      current: {},
      allCount: 0
    },
    filters: [],
    page: 1,
    itemsPerPage: 5,
    sorts: {}
  }),
  computed: {
    headers() {
      return this.metas.list
        .filter(header => !header.hideInTable)
        .map(meta => ({
          ...meta,
          text: meta.title || meta.key,
        }))
        .concat([
          {
            key: 'createdAt',
            text: 'زمان ایجاد',
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          },
          {
            key: 'updatedAt',
            text: 'زمان تغییر',
            timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          }
        ]);
    }
  },
  mounted() {

    if (this.sortLatest) {
      this.sorts = { 'createdAt': -1 };
    }

    this.loadMeta();
    this.loadData();

  },
  watch: {
    query() {
      this.loadData();
    },
    page() {
      this.loadData();
    },
    itemsPerPage() {
      this.loadData();
    },
    sorts() {
      this.loadData();
    },
    filters: {
      deep: true,
      handler: debounce(function() {
        this.loadData();
      }, 500)
    }
  },
  methods: {
    async loadMeta() {
      this.metas.list = await loadMetasFor(this.$apiBase, this.modelName);
    },
    async loadData() {

      const filters = transformFilters(this.filters);
      const sorts = transformSorts(this.sorts);

      const skip = (this.page - 1) * this.itemsPerPage;
      const limit = this.itemsPerPage;

      this.loading = true;
      const [{ status, result }, { status: s2, result: r2 }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}?skip=${skip}&limit=${limit}&${filters}&${sorts}`),
        YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/count?${filters}`)
      ]);
      this.loading = false;

      if (this.$generalHandle(status, result) || this.$generalHandle(s2, r2)) return;

      this.resources.list = result;
      this.resources.allCount = r2;

    },
    initEditor(resource) {
      this.$dialog(import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
        width: '550px',
        modelName: this.modelName,
        baseResource: resource
      }).then(result => result && this.loadData());
    },
    async deleteResource(resource) {
      if (await this.$dialogConfirmDelete()) {

        const { status, result } = await YNetwork.delete(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/${resource._id}`);

        if (this.$generalHandle(status, result)) return;

        this.$toast('حذف با موفقیت انجام شد');

        this.loadData();

      }
    }
  }
}

</script>