<template>
  <div>
    <v-text-field
      readonly
      :filled="!field.unfilled"
      :solo="field.solo || field.simple"
      :flat="field.flat || field.simple"
      :outlined="field.outlined"
      :dense="field.dense"
      :loading="loading"
      :value="loading ? loadingText : title"
      :background-color="field.background"
      :label="field.title"
      :placeholder="field.placeholder"
      :class="field.classes"
      :dir="field.dir"
      :disabled="field.disabled"
      :autofocus="field.autofocus"
      :hide-details="!field.message"
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

import Api from '../../../api';
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
    loading: false,
    loadingText: '',
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
    async handleUpdate(event) {

      const file = event.target.files[0];
      if (!file) return;

      if (this.field.fileValidator && !this.field.fileValidator(file)) return;

      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      const fileSize = file.size;

      this.loading = true;
      this.loadingText = '---';
      const { status, result } = await Api.Media.initUpload(fileName, fileExtension, fileSize);
      if (status !== 200) {
        this.loading = false;
        return;
      }

      const { fileToken } = result;

      const xhr = new XMLHttpRequest();
      const url = `${Api.Media.ENDPOINT_UPLOAD_PATH}/${fileToken}`;

      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {

          this.loading = false;
          if (xhr.status !== 201) return;

          const uploadResult = JSON.parse(xhr.response);
          this.$emit('input', uploadResult.mediaId);

          await this.$nextTick();
          this.validateValue();

        }
      };

      xhr.upload.onprogress = (progressEvent) => {
        this.loadingText = +( (progressEvent.loaded) * 100 / progressEvent.total ).toFixed(2) + '%';
      };

      xhr.open('POST', url, true);
      xhr.setRequestHeader('Authorization', this.$token);
      xhr.send(file);

    },
    async loadMedia() {
      if (!this.value) return;

      const { status, result } = await Api.Media.loadOne(this.value);
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
