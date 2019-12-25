<template>
  <div class="filter-section align-center">

    <div class="part me-2" v-for="filter in value" :key="filter[0]">
      <v-select class="small-text" dense solo flat background-color="transparent" style="width: 120px;" hide-details v-model="filter.key" :items="metas.map(meta => ({ value: meta.key, text: meta.title }))" />
      <v-select class="small-text" dense solo flat background-color="transparent" style="width: 85px;" hide-details v-model="filter.operator" :items="$options.Operators" />
      <v-text-field class="small-text" placeholder="جستجو" dense solo flat :value="filter.value" style="width: 120px;" background-color="transparent" hide-details />
    </div>

    <v-btn icon small @click="addFilter">
      <v-icon small>mdi-plus</v-icon>
    </v-btn>

  </div>
</template>

<script>
export default {
  name: 'YResourceFilter',
  props: {
    value: Object,
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
  ::v-deep {
    .small-text {
      .v-input__slot {
        padding: 0 4px !important;
      }
      input, .v-select__selection {
        font-size: 0.75rem !important;
      }
    }
  }
</style>