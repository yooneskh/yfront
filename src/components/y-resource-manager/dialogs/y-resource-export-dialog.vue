<template>
  <v-card flat>

    <v-card-title>
      <v-icon v-if="icon" class="me-3">
        {{ icon }}
      </v-icon>
      {{ title || 'Export Data' }}
    </v-card-title>

    <v-card-text v-if="!completed" class="d-flex flex-column align-center justify-center pa-12">

      <div class="text-body-1 ltred">
        {{ Math.max(0, records.length - 1) }} / {{ allCount }}
      </div>

      <v-progress-circular indeterminate color="primary" size="20" class="mt-3" />

    </v-card-text>

    <v-card-text v-if="completed && populating" class="d-flex flex-column align-center justify-center pa-12">

      <div class="text-body-1 ltred">
        {{ populatedCount }} / {{ allPopulateCount }}
      </div>

      <v-progress-circular indeterminate color="primary" size="20" class="mt-3" />

    </v-card-text>

    <v-card-text v-if="completed && !populating">
      Exporting has finished. Click on the button below to downlaod the file.
    </v-card-text>

    <v-card-actions>

      <v-btn v-if="!completed" text color="warning" @click="finalizeExport();">
        Stop and Partial Download
      </v-btn>

      <v-btn v-if="completed && !populating" depressed color="primary" @click="downloadFile();">
        Download Export
        <v-icon right>
          mdi-download
        </v-icon>
      </v-btn>

      <v-spacer />

      <v-btn text color="error" @click="$emit('resolve', undefined)">
        Cancel
      </v-btn>

    </v-card-actions>

  </v-card>
</template>

<script>

import { YNetwork } from 'ynetwork';
import { convertObjectMetaToArray, loadMetasFor, pluralizeModelName, transformFilters, transformResourceToTitle, transformSorts } from '../y-resource-util';
import get from 'lodash/get';
import ExcellentExport from 'excellentexport';


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
    records: [],
    rows: [],
    completed: false,
    populating: false,
    populatedCount: false,
    allPopulateCount: false
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
    async initInfo() {

      this.metas = await loadMetasFor(this.$apiBase, this.model);
      const { status, data } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/count?${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, data)) return;

      this.allCount = data;
      this.exportDatas(0, this.batchSize);

    },
    async getMetaTitles(meta, prefixes, path) {
      if (meta.type !== 'series') {
        return [[...prefixes, meta.title].join(' - ')];
      }


      const groupProperty = meta.seriesReportGroupBy;

      if (!groupProperty) {
        return [[...prefixes, meta.title].join(' - ')];
      }


      const seriesRecords = this.records.flatMap(record =>
        get(record, [...path, meta.key])
      );

      const propertyGroups = (
        seriesRecords.flatMap(it =>
          get(it, groupProperty)
        )
      );


      const uniqueGroup = [ ...new Set(propertyGroups) ];

      const uniqueGroupMapped = (
        (await Promise.all(
          uniqueGroup.map(it =>
            this.transformElement(it, meta.seriesSchema[groupProperty])
          )
        ))
        .reduce((a, b) => [...a, ...b], [])
      );


      return uniqueGroupMapped.map(it =>
        `${meta.title} - ${it}`
      );

    },
    async exportDatas(skip, limit) {
      if (this.completed) return;

      const { status, data } = await YNetwork.get(`${this.$apiBase}/${this.pluralModelName}/?skip=${skip}&limit=${limit}&${this.queryFilters}&${this.querySorts}`)
      if (this.$generalHandle(status, data)) return;
      if (this.completed) return;
      if (data.length === 0) return this.finalizeExport();


      this.records.push(...data);
      setTimeout(() => this.exportDatas(skip + limit, limit), this.batchDelay);

    },
    async transformData(data, metas, path) {
      return (
        (await Promise.all(
          metas.map(meta =>
            this.transformElement(data[meta.key], meta, [...path, meta.key])
          )
        ))
        .reduce((a, b) => [...a, ...b], [])
      );
    },
    async transformElement(element, meta, path) {
      try {
        if (meta.type === 'series') {
          if (!element || !(element.length > 0)) return ['---'];

          const groupProperty = meta.seriesReportGroupBy;

          if (!groupProperty) {

            const elementTexts = await Promise.all(
              element.map(it =>
                this.transformData(
                  it,
                  this.filterShowableMetas(
                    convertObjectMetaToArray(meta.seriesSchema)
                  ),
                  path
                )
              )
            );

            return [
              elementTexts
                .map(it => `(${it.join(' ')})`)
                .join(' - ')
            ];

          }


          const allUniqueGroups = (
            [...new Set(
              this.records.flatMap(record =>
                get(record, [...path])
              )
              .flatMap(it =>
                get(it, groupProperty)
              )
            )]
          );

          return allUniqueGroups.map(group => {

            const item = element.find(i => i[groupProperty] === group);
            if (!item) {
              return '---';
            }

            const otherItemKeys = Object.keys(item).filter(i => !['_id', 'createdAt', 'updatedAt', groupProperty].includes(i));

            if (otherItemKeys.length === 1) {
              return item[otherItemKeys[0]];
            }

            return (
              otherItemKeys
                .map(i => `(${i}: ${item[i]})`)
                .join(' ')
            );

          });

        }
        else if (Array.isArray(element)) {
          return [
            (await Promise.all( element.map(it => this.transformElement(it, meta, path)) )).reduce((a, b) => [...a, ...b], []).join(' - ')
          ];
        }
        else if (meta.variants) {
          return [
            Object.keys(meta.variants).map(lang => `(${lang}) ${element[lang]}`).join(' - ')
          ];
        }
        /* else if (is relation) {} */
        else if (meta.labelFormat || meta.valueFormat) {
          return [
            !(element > 0) ? '---' : this.$formatTime(element, meta.labelFormat || meta.valueFormat)
          ];
        }
        else if (meta.ref === 'Media') {
          const { status, data: media } = await YNetwork.get(`${this.$apiBase}/media/${element}?selects=path`);
          return [
            status === 200 ? media.path : '---'
          ];
        }
        else if (meta.ref) {
          if (element) {
            return [
              await transformResourceToTitle(this.$apiBase, meta.ref, element)
            ];
          }
          else {
            return ['---'];
          }
        }
        else if (meta.type === 'boolean') {
          return [
            element ? 'Yes' : 'No'
          ];
        }
        else if (meta.items && meta.items.find(it => it === element || it.value === element)) {
          return [
            meta.items.find(it => it === element || it.value === element).text
          ];
        }
        else {
          return [element];
        }
      }
      catch (error) {
        return ['---'];
      }
    },
    finalizeExport() {
      this.completed = true;
      this.populateRows();
    },
    async populateRows() {

      this.allPopulateCount = this.records.length + 1;
      this.populating = true;

      const mappedMetaTitles = await Promise.all(
        this.metas.map(it => this.getMetaTitles(it, [], []))
      );

      this.rows.push(
        mappedMetaTitles.reduce((a, b) => [...a, ...b], [])
      );


      for (const record of this.records) {

        this.rows.push(
          await this.transformData(record, this.visibleMetas, [])
        );

        this.populatedCount = this.populatedCount + 1;

      }

      this.populating = false;

    },
    async downloadFile() {

      const fileName = `${this.pluralModelName}-export-${this.$formatTime(Date.now(), 'YYYY-MM-DD-HH-mm-ss')}`;

      ExcellentExport.convert(
        {
          filename: fileName,
          format: 'xlsx',
          openAsDownload: true
        },
        [
          {
            name: this.pluralModelName,
            from: {
              array: this.rows,
            }
          }
        ]
      );

    }
  }
};

</script>
