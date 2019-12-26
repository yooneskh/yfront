<template>
  <div class="filter-section align-center">

    <y-filter-element
      class="part me-2"
      v-for="filter in value" :key="filter[0]"
      :filter="filter"
      :metas="metas"
    />

    <v-btn class="my-1" icon small @click="addFilter">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>

  </div>
</template>

<script>
export default {
  name: 'YResourceFilter',
  components: {
    'y-filter-element': () => import('./y-resource-filter-element' /* webpackChunkName: 'y-resource-filter-element' */),
  },
  props: {
    value: Array,
    metas: Array
  },
  Operators: [
    { value: '=', text: 'مساوی' },
    { value: '!=', text: 'نامساوی' },
    { value: '>', text: 'بیشتر' },
    { value: '<', text: 'کمتر' },
    { value: '~=', text: 'شامل' }
  ],
  methods: {
    addFilter() {
      this.value.push({ key: this.metas[0].key, operator: '=', value: '' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .filter-section {
    background: rgba(black, 0.08);
    transition: background 0.2s ease-in-out;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    &:hover {
      background: rgba(black, 0.10);
    }
    & > .part {
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      & > * {
        width: 150px;
      }
    }
  }
</style>