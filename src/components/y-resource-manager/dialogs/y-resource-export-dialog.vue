<template>
  <v-card flat>

    <v-card-title>
      <v-icon v-if="icon" class="me-3">
        {{ icon }}
      </v-icon>
      {{ title || 'خروجی داده' }}
    </v-card-title>

    <v-card-text v-if="!completed" class="d-flex flex-column align-center justify-center pa-12">

      <div class="text-body-1 ltred">
        {{ Math.max(0, rows.length - 1) }} / {{ allCount }}
      </div>

      <v-progress-circular indeterminate color="primary" size="20" class="mt-3" />

    </v-card-text>

    <v-card-text v-if="completed">
      عملیات خروجی گرفتن به اتمام رسید. برای دانلود خروجی روی دکمه زیر کلیک کنید.
    </v-card-text>

    <v-card-actions>

      <v-btn v-if="!completed" text color="warning" @click="completed = true;">
        توقف و دانلود خروجی ناکامل
      </v-btn>

      <v-btn v-if="completed" depressed color="primary" @click="downloadFile">
        دانلود خروجی
        <v-icon right>
          mdi-download
        </v-icon>
      </v-btn>

      <v-spacer />

      <v-btn text color="error" @click="$emit('resolve', undefined)">
        لغو
      </v-btn>

    </v-card-actions>

  </v-card>
</template>

<script>

import { YNetwork } from 'ynetwork';
import { convertObjectMetaToArray, loadMetasFor, pluralizeModelName, transformFilters, transformResourceToTitle, transformSorts } from '../y-resource-util';

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
      return this.filterShowableMetas(this.metas);
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
    filterShowableMetas(metas) {
      return metas.filter(it => !it.hidden);
    },
    sanitizeString(element) {
      if (!( typeof element === 'string' )) return element;

      return element.replace(/,/g, '').replace(/;/g, '').replace(/\s+/g, ' ');

    },
    async initInfo() {

      this.metas = await loadMetasFor(this.$apiBase, this.model);
      const { status, data } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/count?${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, data)) return;

      this.allCount = data;
      this.rows.push(this.visibleMetas.map(it => it.title));
      this.exportDatas(0, this.batchSize);

    },
    async exportDatas(skip, limit) {
      if (this.completed) return;

      const { status, data: datas } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/?skip=${skip}&limit=${limit}&${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, datas)) return;
      if (this.completed) return;
      if (datas.length === 0) return this.finalizeExport();

      const transformedDatas = await Promise.all(
        datas.map(it =>
          this.transformData(it, this.visibleMetas)
        )
      );
      if (this.completed) return;
      this.rows.push(...transformedDatas);

      setTimeout(() => this.exportDatas(skip + limit, limit), this.batchDelay);

    },
    async transformData(data, metas) {
      return Promise.all(
        metas.map(meta =>
          this.transformElement(data[meta.key], meta)
        )
      );
    },
    async transformElement(element, meta) {
      try {
        if (meta.type === 'series') {
          if (!element || !(element.length > 0)) return '---';

          const elementTexts = await Promise.all(
            element.map(it =>
              this.transformData(
                it,
                this.filterShowableMetas(
                  convertObjectMetaToArray(meta.seriesSchema)
                )
              )
            )
          );

          return elementTexts.map(it => `(${it.join(' ')})`).join(' - ');

        }
        else if (Array.isArray(element)) {
          return (await Promise.all( element.map(it => this.transformElement(it, meta)) )).join(' - ');
        }
        else if (meta.variants) {
          return Object.keys(meta.variants).map(lang => `(${lang}) ${element[lang]}`).join(' - ')
        }
        /* else if (is relation) {} */
        else if (meta.labelFormat || meta.valueFormat) {
          return !(element > 0) ? '---' : this.$formatTime(element, meta.labelFormat || meta.valueFormat);
        }
        else if (meta.ref === 'Media') {
          const { status, data: media } = await YNetwork.get(`${this.$apiBase}/media/${element}?selects=path`);
          return status === 200 ? media.path : '---';
        }
        else if (meta.ref) {
          if (element) {
            return transformResourceToTitle(this.$apiBase, meta.ref, element);
          }
          else {
            return '---';
          }
        }
        else if (meta.type === 'boolean') {
          return element ? 'بله' : 'خیر';
        }
        else if (meta.items && meta.items.find(it => it === element || it.value === element)) {
          return meta.items.find(it => it === element || it.value === element).text;
        }
        else {
          return element;
        }
      }
      catch {
        return '---';
      }
    },
    finalizeExport() {
      this.completed = true;
    },
    downloadFile() {
      this.$downloadAsFile(
        `${this.pluralModelName}-export-${this.$formatTime(Date.now(), 'YYYY-MM-DD-HH-mm-ss')}.csv`,
        [
          '"sep=,"',
          ...this.rows.map(it =>
            it.map(this.sanitizeString).join(',')
          )
        ].join('\n')
      );
    }
  }
};

</script>
