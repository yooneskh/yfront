<template>
  <v-form class="y-form y-form-vuetify" @submit.prevent>
    <v-row class="ma-0 me-n3">
      <v-col v-for="field in validatedFields" class="pt-0 ps-0" :key="field.key" cols="12" :md="field.width || 12" :class="{ 'pb-0': noBottomPadding }" style="position: relative;">
        <component
          :is="mapElementType(field)"
          :target="target"
          :field="field"
          :value="(field.getter && field.getter()) || (field.key && target[field.key])"
          @input="handleInput(field, ...arguments)"
          @update:valid="$set(validations, field.key, $event)"
          @update:key="$emit('update:key', arguments[0], arguments[1])"
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
    },
    valid: {
      type: Boolean,
      default: true
    },
    noBottomPadding: Boolean
  },
  components: {
    'y-form-element-text': require('./y-form-elements/y-form-element-text.vue').default,
    'y-form-element-checkbox': require('./y-form-elements/y-form-element-checkbox.vue').default,
    'y-form-element-checkboxes': require('./y-form-elements/y-form-element-checkboxes.vue').default,
    'y-form-element-select': require('./y-form-elements/y-form-element-select.vue').default,
    'y-form-element-radios': require('./y-form-elements/y-form-element-radios.vue').default,
    'y-form-element-textarea': require('./y-form-elements/y-form-element-textarea.vue').default,
    'y-form-element-file': require('./y-form-elements/y-form-element-file.vue').default,
    'y-form-element-simple-file': require('./y-form-elements/y-form-element-simple-file.vue').default,
    'y-form-element-series': () => import('./y-form-series' /* webpackChunkName: 'y-form-series' */),
    'y-form-element-text-multilang': () => import('./y-form-elements/y-form-element-text-multilang.vue' /* webpackChunkName: 'y-form-element-text-multilang' */),
    'y-form-element-color': () => import('./y-form-elements/y-form-element-color.vue' /* webpackChunkName: 'y-form-element-color' */),
    'y-form-element-date': () => import('./y-form-elements/y-form-element-date.vue' /* webpackChunkName: 'y-form-element-date' */),
    'y-form-element-time': () => import('./y-form-elements/y-form-element-time.vue' /* webpackChunkName: 'y-form-element-time' */),
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */),
    'y-form-element-editor': () => import('./y-form-elements/y-form-element-editor.vue' /* webpackChunkName: 'y-form-element-editor' */)
  },
  data: () => ({
    validations: {}
  }),
  computed: {
    validatedFields() {
      return this.fields.map(field => ({
        ...field,
        error: this.validations[field.key] === false || typeof this.validations[field.key] === 'string',
        success: this.validations[field.key] === true,
        message: typeof this.validations[field.key] === 'string' ? (this.validations[field.key] || 'مقدار وارد شده صحیح نیست!') : undefined
      }));
    }
  },
  watch: {
    validations: {
      deep: true,
      handler() {
        this.checkValidations();
      }
    }
  },
  methods: {
    mapElementType(field) {
      return `y-form-element-${field.type}`;
    },
    checkValidations() {

      const isValid = Object.values(this.validations).filter(v => v !== undefined).every(v => v === true);

      const allFieldKeysWithRules = this.fields.filter(field => !!field.rules && field.rules.length > 0).map(f => f.key);
      const validatedFieldKeys = Object.keys(this.validations);
      const nonValidatedField = allFieldKeysWithRules.filter(key => !validatedFieldKeys.includes(key));
      const isAnyUnvalidated = nonValidatedField.length === 0;

      this.$emit('update:valid', isValid && isAnyUnvalidated);

    },
    handleInput(field, text, auxiliaryValue) {

      if (field.type === 'checkboxes' || field.type === 'switches') {
        if (text) {
          this.$set(this.target, field.key, [
            ...(this.target[field.key] || []),
            text
          ]);
        }
        else {
          if (this.target[field.key]) {

            const index = this.target[field.key].indexOf(auxiliaryValue);

            this.$set(
              this.target,
              this.field.key,
              this.target[field.key].filter((it, itIndex) => index !== itIndex)
            );

          }
        }

        this.$emit('update:key', field.key, this.target[field.key]);
        return;

      }

      const value = field.number ? parseInt(text || field.defaultNumber || '0', field.radix || 10) : text;

      if (field.setter) {
        field.setter(value);
      }
      else {
        this.$set(this.target, field.key, value);
        this.$forceUpdate(); // TODO: remove this !!
      }

      this.$emit('update:key', field.key, this.target[field.key]);

    }
  }
}
</script>
