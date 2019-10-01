<template>
  <div class="file-element mb-4">
    <y-file-uploader :label="field.title" :wrapped="field.wrapped" :class="field.classes" v-model="target[field.key]" />
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
  }
}
</script>
