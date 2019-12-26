<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title v-if="title">
        {{ title }}
        <v-spacer />
        <v-btn text color="primary" @click="initEditor(undefined)">
          افزودن
          &nbsp; <v-icon small class="mt-1">mdi-plus</v-icon>
        </v-btn>
      </v-card-title>

      <!-- <v-text-field filled single-line flat hide-details prepend-inner-icon="mdi-magnify" placeholder="جستجو" v-model="query" /> -->
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
        @update:items-per-page="itemsPerPage = $event"
        @update:sorts="sorts = $event"
        @edit="initEditor"
        @delete="deleteResource">

        <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ header, data }">
          <y-resource-table-cell :key="header.key" :data="data" :header="header" />
        </template>

      </y-table>

    </v-card>

  </div>
</template>

<script>

import YNetwork from 'ynetwork';

export default {
  name: 'YResourceManager',
  components: {
    'y-resource-table-cell': () => import('./y-resource-table-cell' /* webpackChunkName: 'y-resource-table-cell' */),
    'y-resource-filter': () => import('./y-resource-filter' /* webpackChunkName: 'y-resource-filter' */)
  },
  props: {
    title: {
      type: String
    },
    modelName: {
      type: String,
      required: true
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
    itemsPerPage: 10,
    sorts: {}
  }),
  computed: {
    headers() {
      return this.metas.list
      .filter(header => !header.hideInTable)
      .map(meta => ({
        key: meta.key,
        text: meta.title || meta.key,
        type: meta.type,
        ref: meta.ref,
        dir: meta.dir,
        languages: meta.languages
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
  async mounted() {
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
    }
  },
  methods: {
    async loadMeta() {

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/metas`);
      this.loading = false;

      if (this.$generalHandle(status, result)) return;

      this.metas.list = result;

    },
    async loadData() {
      
      const filters = this.transformFilters(this.filters); // TODO: this method!

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}`);
      const { status: s2, result: r2 } = await YNetwork.get(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/count`);
      this.loading = false;

      if (this.$generalHandle(status, result) || this.$generalHandle(s2, r2)) return;

      this.resources.list = result;
      this.resources.allCount = r2;

    },
    initEditor(resource) {
      this.$dialog(() => import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
        width: '400px',
        modelName: this.modelName,
        baseResource: resource
      }).then(result => result && this.loadData());
    },
    async deleteResource(resource) {
      if (await this.$dialog(() => import('../../dialogs/confirm-delete' /* webpackChunkName: 'confirm-delete' */))) {

        const { status, result } = await YNetwork.delete(`${this.$apiBase}/${this.modelName.toLowerCase() + 's'}/${resource._id}`);

        if (this.$generalHandle(status, result)) return;

        this.$toast('حذف با موفقیت انجام شد');

        this.loadData();

      }
    }
  }
}

</script>

<style>

</style>