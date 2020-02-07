<template>
  <span
    class="y-editable-text"
    contenteditable
    v-text="value || placeholder"
    @keyup="handleChange"
    @blur="handleEnd"
    @keydown.enter.prevent="handleEnd"
  />
</template>

<script>
export default {
  name: 'YEditableText',
  props: {
    value: String,
    lazy: Boolean,
    placeholder: String
  },
  methods: {
    handleChange(event) {
      if (!this.lazy) {
        this.$emit('input', event.target.innerText);
      }
    },
    handleEnd(event) {
      this.$emit('input', event.target.innerText);
      this.$el.blur();
    }
  }
}
</script>