<template>
  <div class="y-form-element-editor">
    <div class="caption">{{ field.title }}</div>
    <y-rich-editor
      :value="value"
      @input="$emit('input', $event)"
      :placeholder="field.placeholder"
      class="grey lighten-5 py-2 px-2"
      :class="field.classes"
      style="border-radius: 8px;"
    />
  </div>
</template>

<script>

import Editor from '../../y-rich-editor';

export default {
  name: 'YFormElementText',
  components: {
    'y-rich-editor': Editor
  },
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  }
}

</script>
