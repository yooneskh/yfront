<template>
  <v-card flat>

    <v-card-title class="pe-3">

      <v-icon class="me-3">mdi-map</v-icon>
      Select {{ type[0].toUpperCase() + type.slice(1) }}

      <v-spacer />

      <v-btn text color="primary" :disabled="!isValid" @click="submitValue">
        Select
        <v-icon right>mdi-check</v-icon>
      </v-btn>

    </v-card-title>
      <!-- @update:bounds="handleChange" -->
      <!-- :options="{}" -->
    <l-map
      v-if="active"
      :zoom="zoom"
      :center="!center ? undefined : $latlng(center[0], center[1])"
      @update:zoom="zoom = $event"
      @update:center="handleCenterChange"
      @click="handleMapClick"
      style="height: 512px;">
      <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <l-marker v-for="marker of markers" :key="marker[0]" :lat-lng="$latlng(marker[1], marker[2])" />
    </l-map>

  </v-card>
</template>

<script>

import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'YFormGeoSelector',
  components: {
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker
  },
  props: {
    type: String,
    defaultZoom: {},
    defaultCenter: {},
    value: {},
    multiple: Boolean,
    selectPointByCenter: Boolean
  },
  data: () => ({
    active: false,
    zoom: undefined,
    center: undefined,
    markers: []
  }),
  computed: {
    isValid() {

      if (this.type === 'point') {
        return this.markers.length === 1;
      }

      return false;

    }
  },
  mounted() {

    setTimeout(() => this.active = true, 400);

    this.zoom = this.value?.zoom ?? this.defaultZoom ?? 13;

    if (this.value?.coordinates && this.value?.type?.toLowerCase() === this.type) {
      if (this.type === 'point') {

        this.markers = [
          [this.$uuid(), this.value.coordinates[0], this.value.coordinates[1]]
        ];

        this.center = [this.value.coordinates[0], this.value.coordinates[1]];

      }
    }
    else if (this.defaultCenter) {
      this.center = [this.defaultCenter[0], this.defaultCenter[1]];
    }

  },
  methods: {
    $latlng(longitude, latitude) {
      return latLng(latitude, longitude);
    },
    submitValue() {

      if (this.type === 'point') {
        return this.$emit('resolve', {
          type: 'Point',
          zoom: this.zoom,
          coordinates: [ this.markers[0][1], this.markers[0][2] ]
        });
      }

    },
    handleCenterChange(event) {

      const { lat, lng } = event;

      this.center = [lng, lat];

      if (this.type === 'point' && this.selectPointByCenter) {
        this.markers = [
          [this.$uuid(), lng, lat]
        ];
      }

    },
    handleMapClick(event) {

      const { latlng: { lat, lng } } = event;

      if (this.type === 'point') {
        this.markers = [
          [this.$uuid(), lng, lat]
        ];
      }
      else {
        alert('unsupported geo type');
      }


    }
  }
}
</script>