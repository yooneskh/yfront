<template>
  <div class="file-element mb-4">
    <y-file-uploader
      :label="field.title"
      :wrapped="field.wrapped"
      :class="field.classes"
      :value="(field.getter && field.getter()) || (field.key && target[field.key])"
      @input="handleInput"
    />
  </div>
</template>

<script>
export default {
  name: 'YFormElementFile',
  components: {
    'y-file-uploader': () => import('../../y-file-uploader.vue' /* webpackChunkName: 'y-file-uploader' */)
  },
  props: {
    target: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleInput(value) {
      if (this.field.setter) {
        this.field.setter(value);
      }
      else {
        this.$set(this.target, this.field.key, value);
      }
    }
  }
}
</script>
