<template>
  <div>

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <v-btn block depressed color="primary" @click="selectGeo">
      Choose {{ field.geo }} {{ valueTitle }}
    </v-btn>

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>

import { YFormElementMixin } from 'ykh-form-extended';
import YFormGeoSelector from './dialogs/y-form-geo-selector.vue';

export default {
  name: 'YFormElementGeo',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  computed: {
    valueTitle() {

      if (this.field.geo === 'point' && this.value && this.value.coordinates && this.value.coordinates.length === 2) {
        return `${this.value.coordinates[0].toFixed(7)} | ${this.value.coordinates[1].toFixed(7)}`;
      }

      return ':::';

    }
  },
  mounted() {

  },
  methods: {
    async selectGeo() {

      const result = await this.$dialog(YFormGeoSelector, {
        width: 712,
        type: this.field.geo,
        value: this.value,
        selectPointByCenter: this.field.selectPointByCenter === 'auto' ? this.$isMobile : this.field.selectPointByCenter,
        defaultCenter: this.field.defaultCenter,
        defaultZoom: this.field.defaultZoom
      }); if (!result) return;

      this.$emit('input', result);
      await this.$nextTick();
      this.validateValue();

    }
  }
};

</script>
