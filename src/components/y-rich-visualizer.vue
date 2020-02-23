<template>
  <div class="y-rich-visualizer" :style="`padding: ${paddingVertical}px ${paddingHorizontal}px`">
    <div v-for="(part, index) in parts" :key="part.type + index">
      <div v-if="part.type === 'title'" class="headline font-weight-bold">{{ part.content }}</div>
      <p v-if="part.type === 'text'" class="body-1">{{ part.content }}</p>
      <v-img v-if="part.type === 'image'" :src="part.content" style="max-width: unset;" :style="`margin: 0 -${paddingHorizontal}px`" />
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