<template>
  <div class="y-rich-editor">
    <div v-for="(part, index) in parts" :key="index" class="editor-item">

      <h2
        v-if="part.type === 'title'"
        class="title">
        <y-editable-text v-model="parts[index].content" lazy placeholder="Empty Text ..." />
      </h2>

      <p v-if="part.type === 'text'">
        <y-editable-text v-model="parts[index].content" lazy placeholder="Empty Text ..." />
      </p>

      <v-img
        v-if="part.type === 'image'"
        :src="part.content"
      />

      <v-btn class="delete-button" icon small color="error" @click="parts.splice(index, 1)">
        <v-icon small>mdi-close</v-icon>
      </v-btn>

    </div>

    <div class="add-bar text-center mt-4 mx-auto grey lighten-4 py-1 px-4 mb-4" style="width: 300px; border-radius: 32px;">
      <span class="caption me-4">افزودن</span>
      <v-btn class="ms-2" icon @click="parts.push({ type: 'title', content: '' })"> <v-icon>mdi-format-title</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="parts.push({ type: 'text', content: '' })"> <v-icon>mdi-text-subject</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="addImage"> <v-icon>mdi-image</v-icon> </v-btn>
    </div>

  </div>
</template>

<script>

import Api from '../api';
import YEditableText from './y-editable-text';

export default {
  name: 'YRichEditor',
  components: {
    'y-editable-text': YEditableText
  },
  props: {
    value: String
  },
  data: () => ({
    parts: []
  }),
  watch: {
    value: {
      immediate: true,
      handler() {
        this.generateParts();
      }
    }
  },
  methods: {
    generateParts() {
      this.parts = this.value.split(/\s*-----/g).filter(Boolean).map(line => ({
        type: line.split('\n')[0],
        content: line.split('\n')[1]
      }));
    },
    async addImage() {

      const form = await this.$dialog(() => import('../dialogs/form-maker' /* webpackChunkName: 'y-form-maker-dialog' */), {
        fields: [
          { key: 'file', type: 'file', title: 'فایل', wrapped: false }
        ]
      });
      
      if (!form || !form.file) return;

      const { status, result } = await Api.Media.loadOne('', form.file);
      if (this.$generalHandle(status, result)) return;

      this.parts.push({ type: 'image', content: result.path });

    }
  }
}
</script>

<style lang="scss" scoped>
  .y-rich-editor {

    .editor-item {
      position: relative;
      & > .delete-button {
        position: absolute;
        top: 4px;
        left: 4px;
        opacity: 0;
      }
      &:hover .delete-button {
        opacity: 1;
      }
    }
    .add-bar .v-btn {
      cursor: pointer !important;
    }
  }
</style>