<template>
  <v-form class="y-form y-form-vuetify" @submit.prevent>
    <v-row>
      <v-col v-for="field in fields" class="pt-0" :key="field.key" cols="12" :md="field.width || 12">
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
    'y-form-series': () => import('./y-form-series' /* webpackChunkName: 'y-form-series' */),
    'y-form-element-text-multilang': () => import('./y-form-elements/y-form-element-text-multilang.vue' /* webpackChunkName: 'y-form-element-text-multilang' */),
    'y-form-element-color': () => import('./y-form-elements/y-form-element-color.vue' /* webpackChunkName: 'y-form-element-color' */),
    'y-form-element-date': () => import('./y-form-elements/y-form-element-date.vue' /* webpackChunkName: 'y-form-element-date' */),
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */)
  },
  methods: {
    mapElementType(field) {
      switch (field.type) {
        case 'series': return 'y-form-series';
        case 'text': return 'y-form-element-text';
        case 'textarea': return 'y-form-element-textarea';
        case 'text-multilang': return 'y-form-element-text-multilang';
        case 'checkbox': return 'y-form-element-checkbox';
        case 'file': return 'y-form-element-file';
        case 'select': return 'y-form-element-select';
        case 'radios': return 'y-form-element-radios';
        case 'date': return 'y-form-element-date';
        case 'resource': return 'y-form-element-resource';
        default: return '--no-such-form-element--';
      }
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