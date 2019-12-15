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

      <y-table
        :headers="headers"
        :items="resources.list"
        :actions="[
          { key: 'edit', icon: 'mdi-pen' },
          { key: 'delete', icon: 'mdi-delete', color: 'error' }
        ]"
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
    'y-resource-table-cell': () => import('./y-resource-table-cell' /* webpackChunkName: 'y-resource-table-cell' */)
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
      current: {}
    }
  }),
  computed: {
    headers() {
      return this.metas.list
      .filter(header => !header.hideInTable)
      .map(meta => ({
        key: meta.key,
        text: meta.title || meta.key,
        ref: meta.ref,
        dir: meta.dir,
        languages: meta.languages
      }))
      .concat([
        {
          key: 'createdAt',
          text: 'زمان ایجاد',
          timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
          class: 'text-center ltred'
        },
        {
          key: 'updatedAt',
          text: 'زمان تغییر',
          timeFormat: 'jYYYY/jMM/jDD HH:mm:ss',
          class: 'text-center ltred'
        }
      ]);
    }
  },
  async mounted() {
    await this.loadMeta();
    await this.loadData();
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

      this.loading = true;
      const { status, result } = await YNetwork.get(this.$apiBase + '/' + this.modelName.toLowerCase() + 's');
      this.loading = false;

      if (this.$generalHandle(status, result)) return;

      this.resources.list = result;

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