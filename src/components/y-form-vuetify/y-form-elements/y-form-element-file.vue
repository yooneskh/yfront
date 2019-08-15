<template>
  <div class="file-element">
    <y-file-uploader :label="field.title" :class="field.classes" v-model="target[field.key]" />
  </div>
</template>

<script>
export default {
  name: 'YFormElementFile',
  components: {
    'y-file-uploader': () => import('../../y-file-uploader.vue')
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
