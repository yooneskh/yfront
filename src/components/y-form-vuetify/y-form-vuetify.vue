<template>
  <v-form class="y-form y-form-vuetify">
    <v-row wrap>
      <v-col v-for="field in fields" class="py-0" :key="field.key" :cols="field.width || 12">
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
    'y-form-series': () => import('./y-form-series' /* webpackChunkName: 'y-form-series' */),
    'y-form-element-text': () => import('./y-form-elements/y-form-element-text.vue' /* webpackChunkName: 'y-form-element-text' */),
    'y-form-element-text-multilang': () => import('./y-form-elements/y-form-element-text-multilang.vue' /* webpackChunkName: 'y-form-element-text-multilang' */),
    'y-form-element-checkbox': () => import('./y-form-elements/y-form-element-checkbox.vue' /* webpackChunkName: 'y-form-element-checkbox' */),
    'y-form-element-select': () => import('./y-form-elements/y-form-element-select.vue' /* webpackChunkName: 'y-form-element-select' */),
    'y-form-element-radios': () => import('./y-form-elements/y-form-element-radios.vue' /* webpackChunkName: 'y-form-element-radios' */),
    'y-form-element-file': () => import('./y-form-elements/y-form-element-file.vue' /* webpackChunkName: 'y-form-element-file' */),
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */),
    'y-form-element-textarea': () => import('./y-form-elements/y-form-element-textarea.vue' /* webpackChunkName: 'y-form-element-textarea' */)
  },
  methods: {
    mapElementType(field) {
      switch (field.type) {
        case 'series': return 'y-form-series';
        case 'text': return 'y-form-element-text';
        case 'textarea': return 'y-form-element-textarea';
        case 'text-multilang': return 'y-form-element-text-multilang';
        case 'checkbox': return 'y-form-element-checkbox';
        case 'select': return 'y-form-element-select';
        case 'radios': return 'y-form-element-radios';
        case 'file': return 'y-form-element-file';
        case 'resource': return 'y-form-element-resource';
      } return '--no-such-form-element--';
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
