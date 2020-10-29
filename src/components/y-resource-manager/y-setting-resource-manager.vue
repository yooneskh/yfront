<template>
  <div class="y-setting-resource-manager">

    <v-card-title>
      <v-icon v-if="icon" class="me-3">{{ icon }}</v-icon>
      {{ title }}
      <v-spacer />
      <v-btn depressed color="primary" @click="saveSetting">
        Save Settings
        <v-icon right>mdi-check</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <y-form
        :target="setting"
        :fields="formFields"
      />
    </v-card-text>

  </div>
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
    setting: {},
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

      this.setting = result;

    },
    async saveSetting() {

      const payload = JSON.parse(JSON.stringify(this.setting));
      const metaKeys = this.metas.map(it => it.key);

      for (const key of Object.keys(payload)) {
        if (!metaKeys.includes(key)) {
          delete payload[key];
        }
      }

      this.loading = true;
      const { status, result } = await YNetwork.patch(`${this.$apiBase}${this.pathSuffix}`, payload);
      this.loading = false;
      if (this.$generalHandle(status, result)) return;

      this.$toast.success('Setting saved successfully!');
      this.loadSetting();

    }
  }
}
</script>
