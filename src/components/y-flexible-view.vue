<template>
  <div class="y-flexible-view" :class="{'compact': $isDesktop}">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'YFlexibleView'
}
</script>

<style lang="scss" scoped>
  .y-flexible-view {
    min-height: 100%;
    &.compact {
      display: block;
      width: 690px;
      margin: auto;
      box-shadow: 0 0 16px 4px rgba(black, 0.1);
    }
  }
</style>
