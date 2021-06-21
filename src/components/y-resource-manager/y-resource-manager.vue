<template>
  <div class="y-resource-manager">
    <v-card :loading="loading">

      <v-card-title class="pe-3">

        <v-icon v-if="icon" class="me-3">{{ icon }}</v-icon>
        {{ title }}

        <v-spacer />

        <slot name="prepend-actions" />

        <v-btn small text @click="initExcelExport">
          گرفتن خروجی
        </v-btn>

        <v-btn v-if="$hasAccesses([`admin.${kebabModelName}.create`])" text color="primary" class="ms-1" @click="(newUrl && $router.push(newUrl)) || initEditor(undefined)">
          افزودن
          <v-icon right>mdi-plus</v-icon>
        </v-btn>

        <slot name="append-actions" />

      </v-card-title>

      <y-resource-filter v-model="filters" :metas="metas.list" />

      <v-tabs v-if="tabGroups" :color="selectedGroup && selectedGroup.color">
        <v-tab v-for="(group, index) of tabGroups" :key="group.title" style="letter-spacing: 0;" @click="selectedGroupTitle = group.title;">

          <v-icon v-if="group.icon" class="me-3">
            {{ group.icon }}
          </v-icon>

          {{ group.title }}

          <v-chip x-small :color="group.color" class="ms-2">
            {{ groupResources[index] && groupResources[index].allCount }}
          </v-chip>

        </v-tab>
      </v-tabs>

      <y-table
        :headers="headers"
        :items="currentResources.list || []"
        :actions="tableActions"
        :loading="loading"
        :server-items-length="currentResources.allCount || 0"
        @update:page="page = $event"
        :items-per-page="itemsPerPage"
        :items-per-page-options="[5, 15, 30]"
        @update:items-per-page="itemsPerPage = $event"
        :sorts.sync="sorts"
        @edit="editHandler ? editHandler($event) : initEditor($event)"
        @delete="deleteResource"
        v-on="customActionListeners">
        <template v-for="header in headers" v-slot:[`item-${header.key}`]="{ data }">
          <y-resource-table-cell :key="header.key + data" :data="data" :header="header" />
        </template>
      </y-table>

    </v-card>
  </div>
</template>

<script>

import YResourceTableCell from './y-resource-table-cell.vue';
import YResourceFilter from './y-resource-filter.vue';

import YNetwork from 'ynetwork';
import debounce from 'lodash/debounce';
import { loadMetasFor, pluralizeModelName, transformFilters, transformSorts } from './y-resource-util';
import kebabCase from 'lodash/kebabCase';

export default {
  name: 'YResourceManager',
  components: {
    'y-resource-table-cell': YResourceTableCell,
    'y-resource-filter': YResourceFilter
  },
  props: {
    title: {
      type: String
    },
    icon: {
      type: String
    },
    modelName: {
      type: String,
      required: true
    },
    sortLatest: {
      type: Boolean,
      default: false
    },
    newUrl: {
      type: String
    },
    editHandler: {
      type: Function
    },
    customActions: {
      type: Array
    },
    editorWidth: {
      default: '550px'
    },
    tabGroups: {
      type: Array
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
    sorts: {},
    selectedGroupTitle: undefined,
    groupResources: []
  }),
  computed: {
    kebabModelName() {
      return kebabCase(this.modelName);
    },
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
            labelFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          },
          {
            key: 'updatedAt',
            text: 'زمان تغییر',
            labelFormat: 'jYYYY/jMM/jDD HH:mm:ss',
            dir: 'ltr'
          }
        ]);
    },
    tableActions() {

      const actions = [];

      actions.push(...(this.customActions || []));

      actions.push(
        { key: 'edit', icon: 'mdi-pen', permissions: [`admin.${this.kebabModelName}.update`] },
        { key: 'delete', icon: 'mdi-delete', color: 'error', permissions: [`admin.${this.kebabModelName}.delete`] }
      );

      return actions;

    },
    customActionListeners() {

      const listeners = {};

      for (const action of this.customActions || []) {
        listeners[action.key] = (item) => action.handler?.(item, this) ?? this.$emit(action.key, item);
      }

      return listeners;

    },
    selectedGroup() {
      if (!this.tabGroups || this.tabGroups.length === 0) return undefined;
      return this.tabGroups.find(it => it.title === this.selectedGroupTitle);
    },
    currentResources() {
      if (!this.tabGroups) return this.resources;
      if (!this.selectedGroupTitle) return {};

      return this.groupResources.find(it => it.title === this.selectedGroupTitle);

    }
  },
  watch: {
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
  created() {
    if (this.sortLatest) {
      this.sorts = { 'createdAt': -1 };
    }
  },
  mounted() {

    this.loadMeta();

    if (!this.sortLatest) { // todo: because it would be done twice, to be fixed
      this.loadData();
    }

  },
  methods: {
    async loadMeta() {
      this.metas.list = await loadMetasFor(this.$apiBase, this.modelName);
    },
    async loadData() {
      if (this.tabGroups) return this.loadGroupsData();

      const filters = transformFilters(this.filters);
      const sorts = transformSorts(this.sorts);

      const skip = (this.page - 1) * this.itemsPerPage;
      const limit = this.itemsPerPage;

      this.loading = true;
      const [{ status, result }, { status: s2, result: r2 }] = await Promise.all([
        YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}?skip=${skip}&limit=${limit}&${filters}&${sorts}`),
        YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}/count?${filters}`)
      ]);
      this.loading = false;
      if (this.$generalHandle(status, result) || this.$generalHandle(s2, r2)) return;

      this.resources.list = result;
      this.resources.allCount = r2;

    },
    async loadGroupsData() {

      const sorts = transformSorts(this.sorts);

      const skip = (this.page - 1) * this.itemsPerPage;
      const limit = this.itemsPerPage;

      this.loading = true;

      const groupResults = await Promise.all(
        this.tabGroups.map(group =>
          Promise.all([
            group.title,
            YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}?skip=${skip}&limit=${limit}&${transformFilters([ ...this.filters, ...group.filters ])}&${sorts}`),
            YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.modelName)}/count?${transformFilters([ ...this.filters, ...group.filters ])}`)
          ])
        )
      );

      this.loading = false;

      this.groupResources = groupResults.map(it => ({
        title: it[0],
        list: it[1].result,
        allCount: it[2].result
      }));

    },
    initEditor(resource) {
      this.$dialog(import('./y-resource-dialog' /* webpackChunkName: 'y-resource-dialog' */), {
        width: this.editorWidth,
        modelName: this.modelName,
        baseResource: resource
      }).then(result => result && this.loadData());
    },
    async deleteResource(resource) {
      if (!await this.$dialogConfirmDelete()) return;

      const { status, result } = await YNetwork.delete(`${this.$apiBase}/${pluralizeModelName(this.modelName)}/${resource._id}`);
      if (this.$generalHandle(status, result)) return;

      this.$toast('حذف با موفقیت انجام شد');
      this.loadData();

    },
    async initExcelExport() {

      const choice = await this.$dialogYesNo({
        icon: 'mdi-download',
        title: 'خروجی گرفتن از داده‌ها',
        message: `شما در حال خروجی گرفتن از ${this.resources.allCount} داده هستید. آیا می‌خواهید ادامه دهید؟`,
        yesText: 'از داده‌ها خروجی بگیر',
        noText: 'لغو عملیات'
      }); if (!choice) return;

      const exports = await this.$dialog(import('./dialogs/y-resource-export-dialog.vue' /* webpackChunkName: 'y-resource-export-dialog' */), {
        icon: 'mdi-download',
        title: 'خروجی گرفتن از داده‌ها',
        model: this.modelName,
        filters: this.filters,
        sorts: this.sorts
      }); if (!exports) return;

      this.$toast.success('خروجی با موفقیت گرفته شد.');

    }
  }
}

</script>