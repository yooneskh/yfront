<template>
  <span
    class="y-editable-text"
    :contenteditable="!readonly"
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
    readonly: Boolean,
    placeholder: String
  },
  data: () => ({
    hasChanged: false
  }),
  methods: {
    handleChange(event) {

      this.hasChanged = true;

      if (!this.lazy) {
        this.$emit('input', event.target.innerText);
        this.hasChanged = false;
      }

    },
    handleEnd(event) {
      if (this.hasChanged) {
        this.hasChanged = false;
        this.$emit('input', event.target.innerText);
        this.$el.blur();
      }
    }
  }
}
</script>