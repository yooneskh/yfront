<template>
  <v-form class="y-form y-form-vuetify" @submit.prevent>
    <v-row class="ma-0 me-n3">
      <v-col v-for="field in fields" class="pt-0 ps-0" :key="field.key" cols="12" :md="field.width || 12" style="position: relative;">
        <component
          :is="mapElementType(field)"
          :target="target"
          :field="field"
          :value="(field.getter && field.getter()) || (field.key && target[field.key])"
          @input="handleInput(field, $event)"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  name: 'YFormVuetify',
  props: {
    target: {
      type: Object,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  },
  components: {
    'y-form-element-text': require('./y-form-elements/y-form-element-text.vue').default,
    'y-form-element-checkbox': require('./y-form-elements/y-form-element-checkbox.vue').default,
    'y-form-element-select': require('./y-form-elements/y-form-element-select.vue').default,
    'y-form-element-radios': require('./y-form-elements/y-form-element-radios.vue').default,
    'y-form-element-textarea': require('./y-form-elements/y-form-element-textarea.vue').default,
    'y-form-element-file': require('./y-form-elements/y-form-element-file.vue').default,
    'y-form-element-series': () => import('./y-form-series' /* webpackChunkName: 'y-form-series' */),
    'y-form-element-text-multilang': () => import('./y-form-elements/y-form-element-text-multilang.vue' /* webpackChunkName: 'y-form-element-text-multilang' */),
    'y-form-element-color': () => import('./y-form-elements/y-form-element-color.vue' /* webpackChunkName: 'y-form-element-color' */),
    'y-form-element-date': () => import('./y-form-elements/y-form-element-date.vue' /* webpackChunkName: 'y-form-element-date' */),
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */),
    'y-form-element-editor': () => import('./y-form-elements/y-form-element-editor.vue' /* webpackChunkName: 'y-form-element-editor' */),
  },
  methods: {
    mapElementType(field) {
      return `y-form-element-${field.type}`;
    },
    handleInput(field, text) {

      const value = field.number ? parseInt(text || field.defaultNumber || '0', field.radix || 10) : text;

      if (field.setter) {
        field.setter(value);
      }
      else {
        this.$set(this.target, field.key, value);
      }

    }
  }
}
</script>