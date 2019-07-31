<template>
  <v-form class="y-form y-form-vuetify">
    <v-layout wrap>
      <v-flex v-for="field in fields" :key="field.key" v-bind:[makeWidthForField(field)]="true" class="pe-4">
        <component :is="mapElementType(field)" :target="target" :field="field" />
      </v-flex>
    </v-layout>
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
    'y-form-element-text': () => import('./y-form-elements/y-form-element-text.vue'),
    'y-form-element-checkbox': () => import('./y-form-elements/y-form-element-checkbox.vue'),
    'y-form-element-select': () => import('./y-form-elements/y-form-element-select.vue')
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
      } return '--no-such-form-element--';
    }
  }
}
</script>
