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
      <v-btn class="delete-button" icon x-small color="error" @click="parts.splice(index)">
        <v-icon x-small>mdi-close</v-icon>
      </v-btn>
    </div>
    <div class="d-flex flex-row jsutify-center align-center">
      <!-- <v-btn icon -->
    </div>
  </div>
</template>

<script>

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
  }
</style>