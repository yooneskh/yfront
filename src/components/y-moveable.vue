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
    start: [0, 0],
    initial: [0, 0]
  }),
  methods: {
    onDown(event) {

      this.mouseDown = true;

      this.start   = [this.$el.offsetLeft, this.$el.offsetTop];
      this.initial = [event.clientX, event.clientY];

    },
    onMove(event) {
      if (this.mouseDown && event) {

        const dx = event.clientX - this.initial[0];
        const dy = event.clientY - this.initial[1];

        this.$emit('input', [
          this.start[0] + dx,
          this.start[1] + dy
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