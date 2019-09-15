<template>
  <v-form class="y-form y-form-vuetify">
    <v-row wrap>
      <v-col v-for="field in fields" :key="field.key" :cols="field.width || 12">
        <component :is="mapElementType(field)" :target="target" :field="field" />
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
    },
    noPadding: {
      type: Boolean,
      default: false
    }
  },
  components: {
    'y-form-element-text': () => import('./y-form-elements/y-form-element-text.vue' /* webpackChunkName: 'y-form-element-text' */),
    'y-form-element-checkbox': () => import('./y-form-elements/y-form-element-checkbox.vue' /* webpackChunkName: 'y-form-element-checkbox' */),
    'y-form-element-select': () => import('./y-form-elements/y-form-element-select.vue' /* webpackChunkName: 'y-form-element-select' */),
    'y-form-element-file': () => import('./y-form-elements/y-form-element-file.vue' /* webpackChunkName: 'y-form-element-file' */)
  },
  methods: {
    makeWidthForField(field) {
      return `xs${field.width || 12}`;
    },
    mapElementType(field) {
      switch (field.type) {
        case 'text': return 'y-form-element-text';
        case 'checkbox': return 'y-form-element-checkbox';
        case 'select': return 'y-form-element-select';
        case 'file': return 'y-form-element-file';
      } return '--no-such-form-element--';
    }
  }
}
</script>
