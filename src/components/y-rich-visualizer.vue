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
      <template v-if="part.type === 'link'">
        <v-card outlined class="my-4 mx-6 d-flex flex-row pa-1" :to="!part.link || part.link.startsWith('http') ? undefined : part.link" target="_blank" :href="part.link && part.link.startsWith('http') ? part.link : undefined">
          <v-img v-if="part.image" :src="part.image" contain class="me-3 flex-grow-0" height="88" width="88"/>
          <div>
            <div class="text-h6">{{ part.title }}</div>
            <div class="text-subtitle-2 font-weight-light mt-n1">{{ part.domain }}</div>
            <div class="text-body-1 mt-3" style="white-space: nowrap;">{{ part.description }}</div>
          </div>
        </v-card>
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