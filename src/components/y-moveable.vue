<template>
  <div
    class="y-moveable"
    :style="{'left': `${value[0]}px`, 'top': `${value[1]}px`}"
    @mousedown="onDown"
    @mousemove.prevent="onMove"
    @mouseup="onUp"
    @mouseleave="mouseDown = false">

    <slot />

  </div>
</template>

<script>
export default {
  name: 'YMoveable',
  props: {
    value: {
      type: Array,
      default: () => [0, 0]
    }
  },
  data: () => ({
    mouseDown: false,
    offset: [0, 0]
  }),
  methods: {
    onDown(event) {

      this.mouseDown = true;

      this.offset = [
        this.$el.offsetLeft - event.clientX,
        this.$el.offsetTop - event.clientY
      ];

    },
    onMove(event) {
      if (this.mouseDown && event) {
        this.$emit('input', [
          event.clientX + this.offset[0],
          event.clientY + this.offset[1]
        ]);
      }
    },
    onUp() {
      this.mouseDown = false;
    }
  }
}
</script>

<style>
  .y-moveable {
    position: absolute;
  }
</style>