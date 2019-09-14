<template>
  <div class="y-flexible-view" :class="{'compact': $isDesktop, 'padding-method': paddingMethod, 'margin-method': !paddingMethod, 'shadowed': !noShadow}">
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
    },
    paddingMethod: {
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
      &.margin-method {
        width: 690px;
        margin: auto;
      }
      &.padding-method {
        padding: 0 25%;
      }
    }
    &.shadowed {
      box-shadow: 0 0 16px 4px rgba(black, 0.1);
    }
  }
</style>
