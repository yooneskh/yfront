<template>
  <div class="y-flexible-view" :class="{'compact': $isDesktop, 'shadowed': !noShadow}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'YFlexibleView',
  props: {
    noShadow: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .y-flexible-view {

    &.compact {
      display: block;
      width: 690px;
      margin: auto;
    }
    &.shadowed {
      box-shadow: 0 0 16px 4px rgba(black, 0.1);
    }
  }
</style>
