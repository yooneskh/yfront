<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title v-if="title">
        {{ title }}
        <v-spacer />
        <v-btn text color="primary" @click="initEditor(undefined)">
          افزودن مورد جدید
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

        <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ item, header, data }">
          <span :key="header.key" v-if="header.timeFormat">
            {{ data === 0 ? '-' : $formatTime(data, header.timeFormat) }}
          </span>
          <span :key="header.key" v-else-if="header.ref">
            <y-resource-visualizer :apiBase="apiBase" :model="header.ref" :id="data" :key="data" />
          </span>
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
    'y-resource-visualizer': () => import('./y-resource-visualizer' /* webpackChunkName: 'y-dialog-container' */)
  },
  props: {
    title: {
      type: String
    },
    apiBase: {
      type: String,
      required: true
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
      return this.metas.list.map(meta => ({
        key: meta.key,
        text: meta.title || meta.key,
        ref: meta.ref
      })).concat([
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
    makeSlotKeyForHeader(header) {
      return 'item-' + header.key;
    },
    async loadMeta() {

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.apiBase}/${this.modelName.toLowerCase() + 's'}/meta`);
      this.loading = false;

      console.log(status, result);

      this.metas.list = result;

    },
    async loadData() {

      this.loading = true;
      const { status, result } = await YNetwork.get(this.apiBase + '/' + this.modelName.toLowerCase() + 's');
      this.loading = false;

      this.resources.list = result;

    },
    initEditor(resource) {
      this.$dialog(() => import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
        width: '400px',
        apiBase: this.apiBase,
        modelName: this.modelName,
        baseResource: resource
      }).then(this.loadData);
    },
    async deleteResource(resource) {
      if (await this.$dialog(() => import('../../dialogs/confirm-delete' /* webpackChunkName: 'confirm-delete' */))) {

        const { status, result } = await YNetwork.delete(`${this.apiBase}/${this.modelName.toLowerCase() + 's'}/${resource._id}`);

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