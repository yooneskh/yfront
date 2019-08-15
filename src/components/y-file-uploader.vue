<template>
  <div class="y-file-uploader">
    <v-text-field readonly :label="label" :value="stateInfo" outlined flat @click="$refs.theFile.click()" />
    <input class="input" ref="theFile" type="file" @change.passive="theChange" style="display: none;" />
  </div>
</template>

<script>

import Api from '../api';

export default {
  name: 'YFileUploader',
  props: ['value', 'label'],
  data: () => ({
    processing: false,
    error: false,
    mediaId: null,
    stateInfo: '',
    currentFile: null,
  }),
  methods: {
    async theChange(event) {

      if (!event.target.files[0]) return;

      var file = event.target.files[0];

      this.stateInfo = 'در حال شروع ...';

      const fileName = file.name.slice(0, file.name.lastIndexOf('.'));
      const fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1);
      const fileSize = file.size;

      this.processing = true;
      const { status, result } = await Api.Media.initUpload(this.$token(), fileName, fileExtension, fileSize);
      
      if (status == 200) {
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

      http.onreadystatechange = (event) => {
        if (http.readyState == 4) {
          if (http.status == 201) {
            this.processing = false;
            console.log('result', http.response);
            this.handleResult(JSON.parse(http.response));
          }
          else {
            this.error = true;
            this.$emit('on-finish', false);
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

      this.stateInfo = this.currentFile.name;

      this.$emit('input', {_id: result.mediaId});
      this.$emit('on-finish', true);

    }
  }
}

</script>

<style scoped>

</style>
