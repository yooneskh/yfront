<template>
  <div class="filter-section align-center px-1">

    <y-filter-element
      class="part me-2"
      v-for="(filter, index) of value" :key="filter.id"
      :metas="metas"
      :value="filter"
      @input="$emit('input', [
        ...value.slice(0, index),
        $event,
        ...value.slice(index + 1)
      ])"
    />

    <v-btn v-if="value.length > 0" class="my-1 me-1" icon small @click="removeLastFilter">
      <v-icon small>mdi-minus</v-icon>
    </v-btn>

    <v-btn class="my-1" :class="{'ms-2': value.length === 0}" icon small @click="addFilter">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>

  </div>
</template>

<script>

import YResourceFilterElement from './y-resource-filter-element.vue';

export default {
  name: 'YResourceFilter',
  components: {
    'y-filter-element': YResourceFilterElement
  },
  props: {
    value: Array,
    metas: Array
  },
  methods: {
    addFilter() {

      const meta = this.metas[0];
      const hasNotContain = !!meta.labelFormat || !!meta.ref;

      this.$emit(
        'input',
        [
          ...this.value,
          { id: this.$uuid(), key: meta.key, operator: hasNotContain ? '=' : '~=', value: '' }
        ]
      );

    },
    removeLastFilter() {
      this.$emit('input', this.value.filter((_, index) => index !== this.value.length - 1));
    }
  }
};

</script>

<style lang="scss" scoped>
  .filter-section {
    background: rgba(black, 0.08);
    transition: background 0.2s ease-in-out;
    display: flex;
    flex-direction: row;
    min-height: 38px;
    flex-wrap: wrap;
    &:hover {
      background: rgba(black, 0.10);
    }
    & > .part {
      flex-grow: 0;
    }
  }
</style>