<template>
  <div class="rich-visualizer" :style="`padding-bottom: ${parsedConfig.parts.slice(-1)[0].type === 'image' ? '0' : '0.1px'};`">
    <div v-for="(part, index) of parsedConfig.parts" :key="part._id">
      <template v-if="part.type === 'text'">
        <p
          class="text-body-1 px-6 mb-3"
          :class="{ 'mt-6': index === 0, 'mb-6': index === parsedConfig.parts.length - 1 }">
          {{ part.text }}
        </p>
      </template>
      <template v-if="part.type === 'title'">
        <h3
          class="text-h3 px-6 mt-6"
          :class="{ 'mb-6': index === parsedConfig.parts.length - 1 }">
          {{ part.title }}
        </h3>
      </template>
      <template v-if="part.type === 'image'">
        <v-img
          :src="part.path"
          class="my-3"
          :class="{ 'mb-0': index === parsedConfig.parts.length - 1 }"
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
      <template v-if="part.type === 'map'">
        <l-map :zoom="part.zoom" :center="makeLatLong(part.latitude, part.longitude)" :options="{}" :style="`height: ${part.height || '300px'}`">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <l-marker :lat-lng="makeLatLong(part.latitude, part.longitude)" />
        </l-map>
      </template>
    </div>
  </div>
</template>

<script>

import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'YRichVisualizer',
  components: {
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker
  },
  props: {
    config: {
      type: String,
      required: true
    }
  },
  computed: {
    parsedConfig() {
      return JSON.parse(this.config || '{}');
    }
  },
  methods: {
    makeLatLong(latitude, longitude) {
      return latLng(latitude, longitude);
    }
  }
};

</script>