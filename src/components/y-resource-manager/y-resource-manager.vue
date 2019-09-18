<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title v-if="title">{{ title }}</v-card-title>

      <y-table
        :headers="headers"
        :items="resources.list"
        :actions="[
          { key: 'edit', icon: 'mdi-pen' },
          { key: 'delete', icon: 'mdi-delete', color: 'error' }
        ]"
      />

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" @click="initAddNew">افزودن مورد جدید</v-btn>
      </v-card-actions>

    </v-card>

  </div>
</template>

<script>
import YNetwork from 'ynetwork';

export default {
  name: 'YResourceManager',
  components: {

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
        text: meta.title || meta.key
      })).concat([
        {
          key: 'createdAt',
          text: 'زمان ایجاد'
        },
        {
          key: 'updatedAt',
          text: 'زمان تغییر'
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
      const { status, result } = await YNetwork.get(`${this.apiBase}/${this.modelName}/meta`);
      this.loading = false;

      console.log(status, result);

      this.metas.list = result;

    },
    async loadData() {

      this.loading = true;
      const { status, result } = await YNetwork.get(this.apiBase + '/' + this.modelName);
      this.loading = false;

      this.resources.list = result;

    },
    initAddNew() {

      this.$dialog(() => import('./y-resource-dialog'), {
        width: '400px',
        apiBase: this.apiBase,
        modelName: this.modelName
      });

    },
    async doSubmit() {

    }
  }
}

</script>

<style>

</style>