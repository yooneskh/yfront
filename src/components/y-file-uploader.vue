<template>
  <div class="y-file-uploader" style="width: 100%;">
    <v-text-field
      readonly
      :label="label"
      :filled="!unfilled"
      hide-details
      :value="stateInfo"
      prepend-inner-icon="mdi-paperclip"
      :append-icon="path ? 'mdi-open-in-new' : undefined"
      flat
      @click="$refs.theFile.click()"
      @click:append="openPath"
    />
    <input class="input" ref="theFile" type="file" @change.passive="theChange" style="display: none;" />
  </div>
</template>

<script>

import Api from '../api';

export default {
  name: 'YFileUploader',
  props: {
    value: {},
    label: {},
    wrapped: {
      type: Boolean,
      default: true
    },
    unfilled: Boolean
  },
  data: () => ({
    processing: false,
    error: false,
    mediaId: null,
    stateInfo: '',
    currentFile: null,
    path: ''
  }),
  watch: {
    value: {
      handler() {
        if (this.value) this.loadMedia();
      },
      immediate: true
    }
  },
  methods: {
    async theChange(event) {

      if (!event.target.files[0]) return;

      var file = event.target.files[0];

      this.stateInfo = 'در حال شروع ...';

      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      const fileSize = file.size;

      this.processing = true;
      const { status, result } = await Api.Media.initUpload(this.$token, fileName, fileExtension, fileSize);
      
      if (status === 200) {
        this.currentFile = file;
        this.getTheFileData(file, result.fileToken);
      }
      else {
        this.processing = false;
        this.$emit('on-finish', false);
      }

      return false;

    },
    getTheFileData(file, fileToken) {
      this.uploadTheFileData(file, fileToken);
    },
    uploadTheFileData(fileData, fileToken) {

      var http = new XMLHttpRequest();

      var url = `${Api.Media.ENDPOINT_UPLOAD_PATH}/${fileToken}`;

      this.stateInfo = "در حال آپلود ...";

      http.onreadystatechange = () => {
        if (http.readyState === 4) {
          if (http.status === 201) {
            this.processing = false;
            this.handleResult(JSON.parse(http.response));
          }
          else {
            this.error = true;
          }
        }
      };

      http.upload.onprogress = (event) => {
        this.stateInfo = +( (event.loaded) * 100 / event.total ).toFixed(2) + '%'
      };

      http.open('POST', url, true);

      http.send(fileData);

    },
    handleResult(result) {

      this.$emit('input', this.wrapped ? { _id: result.mediaId } : result.mediaId);

      this.loadMedia();

    },
    async loadMedia() {
      if (!this.value && !this.value._id) return;

      const { status, result } = await Api.Media.loadOne(this.$token, this.wrapped ? this.value._id : this.value);

      if (this.$generalHandle(status, result)) return;

      this.stateInfo = `${result.name.toLowerCase()}.${result.extension.toLowerCase()}`;
      this.path = result.path;

    },
    openPath() {
      window.open(this.path, '_blank');
    }
  }
}

</script>
