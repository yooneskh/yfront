<template>
  <v-card flat>

    <v-card-title>
      <v-icon v-if="icon" class="me-3">{{ icon }}</v-icon>
      {{ title || 'خروجی از داده‌ها' }}
    </v-card-title>

    <v-card-text v-if="!completed" class="d-flex flex-column align-center justify-center pa-12">

      <div class="tetx-body-1 ltred">
        {{ Math.max(0, rows.length - 1) }} / {{ allCount }}
      </div>

      <v-progress-circular indeterminate color="primary" size="20" class="mt-3" />

    </v-card-text>

    <v-card-text v-if="completed">
      عملیات خروجی گرفتن به اتمام رسید. برای دانلود فایل بر روی دکمه دانلود خروجی زیر کلیک کنید.
    </v-card-text>

    <v-card-actions>

      <v-btn v-if="!completed" text color="warning" @click="completed = true;">
        توقف و گرفتن خروجی تا الان
      </v-btn>

      <v-btn v-if="completed" depressed color="primary" @click="downloadFile">
        دانلود خروجی
        <v-icon right>mdi-download</v-icon>
      </v-btn>

      <v-spacer />

      <v-btn text color="error" @click="$emit('resolve', undefined)">
        لغو کامل
      </v-btn>

    </v-card-actions>

  </v-card>
</template>

<script>

import YNetwork from 'ynetwork';
import { loadMetasFor, pluralizeModelName, transformFilters, transformResourceToTitle, transformSorts } from '../y-resource-util';

export default {
  name: 'YResourceExportDialog',
  props: {
    icon: String,
    title: String,
    model: String,
    filters: Array,
    sorts: Object,
    batchSize: {
      type: Number,
      default: 5
    },
    batchDelay: {
      type: Number,
      default: 1000
    }
  },
  data: () => ({
    loading: false,
    metas: [],
    allCount: -1,
    rows: [],
    completed: false
  }),
  computed: {
    pluralModelName() {
      return pluralizeModelName(this.model);
    },
    visibleMetas() {
      return this.metas.filter(it => !it.hidden);
    },
    metaKeys() {
      return this.visibleMetas.map(it => it.key);
    },
    queryFilters() {
      return transformFilters(this.filters);
    },
    querySorts() {
      return transformSorts(this.sorts);
    },
  },
  mounted() {
    this.initInfo();
  },
  methods: {
    async initInfo() {

      this.metas = await loadMetasFor(this.$apiBase, this.model);
      const { status, result } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/count?${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, result)) return;

      this.allCount = result;
      this.rows.push(this.visibleMetas.map(it => it.title));
      this.exportDatas(0, this.batchSize);

    },
    async exportDatas(skip, limit) {
      if (this.completed) return;

      const { status, result: datas } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}?skip=${skip}&limit=${limit}&${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, datas)) return;
      if (this.completed) return;
      if (datas.length === 0) return this.finalizeExport();

      const transformedDatas = await Promise.all( datas.map(this.transformData) );
      if (this.completed) return;
      this.rows.push(...transformedDatas);

      setTimeout(() => this.exportDatas(skip + limit, limit), this.batchDelay);

    },
    async transformData(data) {

      const result = [];

      for (const meta of this.visibleMetas) {
        const element = data[meta.key];

        if (meta.type === 'series') {
          result.push('مجموعه');
        }
        else if (Array.isArray(element)) {
          result.push('آرایه');
        }
        else if (meta.languages) {
          result.push('چند زبانه');
        }
        // if is relation
        else if (meta.labelFormat || meta.valueFormat) {
          result.push( !(data > 0) ? '---' : this.$formatTime(element, meta.labelFormat || meta.valueFormat) );
        }
        else if (meta.ref === 'Media') {
          const { status, result: media } = await YNetwork.get(`${this.$apiBase}/media/${element}?selects=path`);
          result.push(status === 200 ? media.path : '---');
        }
        else if (meta.ref) {
          if (element) {
            result.push( await transformResourceToTitle(this.$apiBase, meta.ref, element) );
          }
          else {
            result.push('---');
          }
        }
        else if (meta.type === 'boolean') {
          result.push(element ? 'بله' : 'خیر');
        }
        else if (meta.items && meta.items.find(it => it === element || it.value === element)) {
          result.push(meta.items.find(it => it === element || it.value === element).text);
        }
        else {
          result.push(element);
        }

      }

      return result;

    },
    finalizeExport() {
      this.completed = true;
    },
    downloadFile() {
      this.$downloadAsFile(`${this.model.toLowerCase()}-export-${this.$formatTime(Date.now(), 'YYYY-MM-DD-HH-mm-ss')}.csv`, this.rows.map(it => it.join(',')).join('\n'));
    }
  }
};

</script>
