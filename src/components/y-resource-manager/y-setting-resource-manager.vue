<template>
  <v-card class="y-setting-resource-manager" :loading="loading">

    <v-card-title>
      <v-icon v-if="icon" class="me-3">{{ icon }}</v-icon>
      {{ title }}
      <v-spacer />
      <v-btn depressed color="primary" :disabled="formValid === false || typeof formValid === 'string'" @click="saveSetting">
        ذخیره تنظیمات
        <v-icon right>mdi-check</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <y-form
        ref="theForm"
        :target="setting"
        :fields="formFields"
        :valid.sync="formValid"
      />
    </v-card-text>

  </v-card>
</template>

<script>

import { loadMetasFor, mapMetaToFormFields } from './y-resource-util';
import YNetwork from 'ynetwork';

export default {
  name: 'YSettingResourceManager',
  props: {
    icon: {
      type: String
    },
    title: {
      type: String
    },
    model: {
      type: String,
      required: true
    },
    pathSuffix: {
      type: String,
      required: true
    }
  },
  data: () => ({
    loading: false,
    setting: {},
    original: {},
    formValid: undefined,
    metas: []
  }),
  computed: {
    formFields() {
      return mapMetaToFormFields(this.metas);
    }
  },
  async mounted() {
    await this.loadMeta();
    this.loadSetting();
  },
  methods: {
    async loadMeta() {
      this.metas = await loadMetasFor(this.$apiBase, this.model, this.pathSuffix);
    },
    async loadSetting() {

      this.loading = true;
      const { status, result } = await YNetwork.get(`${this.$apiBase}${this.pathSuffix}`);
      this.loading = false;
      if (this.$generalHandle(status, result)) return;

      this.original = JSON.parse(JSON.stringify(result));
      this.setting = result;

      this.$refs.theForm.revalidateAll();

    },
    async saveSetting() {

      const payload = JSON.parse(JSON.stringify(this.setting));
      const metaKeys = this.metas.map(it => it.key);

      for (const key in payload) {
        if (JSON.stringify(payload[key]) === JSON.stringify(this.original[key])) {
          delete payload[key];
        }
      } if (Object.keys(payload).length === 0) return this.$toast.error('هیچ مقداری تغییر داده نشده است.');

      for (const key in payload) {
        if (!metaKeys.includes(key)) {
          delete payload[key];
        }
      } if (Object.keys(payload).length === 0) return this.$toast.error('هیچ مقداری تغییر داده نشده است.');

      this.loading = true;
      const { status, result } = await YNetwork.patch(`${this.$apiBase}${this.pathSuffix}`, payload);
      this.loading = false;
      if (this.$generalHandle(status, result)) return;

      this.$toast.success('تنظیمات با موفقیت ذخیره شد.');
      this.loadSetting();

    }
  }
}
</script>
