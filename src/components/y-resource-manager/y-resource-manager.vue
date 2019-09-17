<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title v-if="title">{{ title }}</v-card-title>

      <y-table
        :headers="headers"
        :items="resources.list"
        :actions="[
          { key: 'delete', title: 'حذف', icon: 'mdi-plus' },
          { key: 'edit', title: 'ویرایش' }
        ]"
      />

      <v-card-actions>
        <v-spacer />
        <v-btn text color="primary" large @click="initAddNew">افزودن مورد جدید</v-btn>
      </v-card-actions>

    </v-card>

    <v-dialog v-model="modal.open" width="50%">
      <v-card>

        <v-card-title> 
          افزودن مورد جدید
        </v-card-title>

        <v-card-actions>
          <v-spacer />
          <v-btn text color="primary" @click="doSubmit">افزودن</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

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
    },
    modal: {
      open: false,
      data: {}
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
      const { status, result } = await YNetwork.get(this.apiBase + '/meta');
      this.loading = false;

      console.log(status, result);

      this.metas.list = result;

    },
    async loadData() {

      this.loading = true;
      const { status, result } = await YNetwork.get(this.apiBase);
      this.loading = false;

      this.resources.list = result;

    },
    initAddNew() {

      this.modal.open = true;

    },
    async doSubmit() {

    }
  }
}

</script>

<style>

</style>