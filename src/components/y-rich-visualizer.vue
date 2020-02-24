<template>
  <div class="y-rich-visualizer" :style="`padding: ${paddingVertical}px ${paddingHorizontal}px`">
    <div v-for="(part, index) in parts" :key="part.type + index">
      <template v-if="part.type === 'title'">
        <div class="headline font-weight-bold">
          {{ part.content }}
        </div>
      </template>
      <template v-if="part.type === 'text'">
        <p class="body-1">
          {{ part.content }}
        </p>
      </template>
      <template v-if="part.type === 'image'">
        <v-img
          :src="part.content"
          class="my-4"
          style="max-width: unset;"
          :style="`margin-left: -${paddingHorizontal}px; margin-right: -${paddingHorizontal}px;`"
        />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'YRichVisualizer',
  props: {
    text: String,
    paddingVertical: {
      type: Number,
      default: 24
    },
    paddingHorizontal: {
      type: Number,
      default: 24
    }
  },
  computed: {
    parts() {
      return this.text.split(/\s*-----/g).map(part => ({
        type: part.split('\n')[0],
        content: part.split('\n')[1]
      }));
    }
  }
}
</script>