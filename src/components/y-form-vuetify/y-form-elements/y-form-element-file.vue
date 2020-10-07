<template>
  <div>
    <v-text-field
      readonly
      :filled="!field.unfilled"
      :solo="field.solo || field.simple"
      :flat="field.flat || field.simple"
      :outlined="field.outlined"
      :dense="field.dense"
      :value="title"
      :background-color="field.background"
      :label="field.title"
      :placeholder="field.placeholder"
      :class="field.classes"
      :dir="field.dir"
      :disabled="field.disabled"
      :autofocus="field.autofocus"
      hide-details="auto"
      :success="field.success"
      :error="field.error"
      :messages="field.message"
      :hint="field.hint"
      persistent-hint
      @click="!field.readonly && $refs.fileInput.click()"
      @keyup.space="!field.readonly && $refs.fileInput.click()"
      @keyup.enter="!field.readonly && $refs.fileInput.click()"
      prepend-inner-icon="mdi-paperclip"
      :append-icon="path ? 'mdi-open-in-new' : undefined"
      @click:append="openPath"
      @blur="validateValue"
    />
    <input type="file" ref="fileInput" style="display: none;" @change.passive="handleUpdate" />
  </div>
</template>

<script>

import YNetwork from 'ynetwork';
import { ENDPOINT_BASE } from '../../../api/ApiBaseEndpoints';
import { YFormElementMixin } from '../mixins/y-form-element-mixin'

export default {
  name: 'YFormElementFile',
  props: {
    value: {},
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    error: false,
    title: '',
    path: undefined
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        this.loadMedia();
      }
    }
  },
  methods: {
    handleUpdate(event) {

      const file = event.target.files[0];
      if (!file) return;

      if (this.field.fileValidator && !this.field.fileValidator(file)) return;

      const xhr = new XMLHttpRequest();
      xhr.open('post', `${ENDPOINT_BASE}/media`, true);
      xhr.setRequestHeader('Authorization', this.$token);

      const formData = new FormData();
      formData.append('file', file);

      xhr.send(formData);
      this.error = false;

      xhr.onload = () => {
        if (xhr.status === 200) {
          const { mediaId } = JSON.parse(xhr.response);
          this.$emit('input', mediaId);
        }
        else {
          this.title = '';
          this.error = true;
        }
      };

      const app = this;
      xhr.onprogress = (uploadEvent) => {
        app.title = Math.trunc(uploadEvent.loaded * 100 / (uploadEvent.total + 1)) + '%'
      }

    },
    async loadMedia() {
      if (!this.value) return;

      const { status, result } = await YNetwork.get(`${ENDPOINT_BASE}/media/${this.value}/info`);
      if (this.$generalHandle(status, result)) return;

      this.title = result.name;
      this.path = result.path;

    },
    openPath() {
      window.open(this.path);
    }
  }
}

</script>
