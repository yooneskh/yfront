<template>
  <div class="y-rich-visualizer px-4 py-4">
    <div v-for="(part, index) in parts" :key="part.type + index">
      <div v-if="part.type === 'title'" class="headline font-weight-bold">{{ part.content }}</div>
      <p v-if="part.type === 'text'" class="body-1">{{ part.content }}</p>
      <v-img v-if="part.type === 'image'" class="mx-n4" :src="part.content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'YRichVisualizer',
  props: {
    text: String
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