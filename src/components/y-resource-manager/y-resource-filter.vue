<template>
  <div class="filter-section align-center">

    <div class="part me-2" v-for="(filter, index) in value" :key="filter[0]" :class="{'ms-2': index > 0}">
      <v-select class="small-text" dense solo flat background-color="transparent" style="width: 120px;" hide-details v-model="filter[0]" :items="metas.map(meta => ({ value: meta.key, text: meta.title }))" />
      <v-select class="small-text" dense solo flat background-color="transparent" style="width: 85px;" hide-details v-model="filter[1]" :items="$options.Operators" />
      <v-text-field class="small-text" dense solo flat :value="filter[2]" style="width: 120px;" background-color="transparent" hide-details />
    </div>

    <v-btn icon small>
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
  ]
}
</script>

<style lang="scss" scoped>
  .filter-section {
    background: rgba(black, 0.08);
    transition: background 0.2s ease-in-out;
    display: flex;
    flex-direction: row;
    &:hover {
      background: rgba(black, 0.10);
    }
    & > .part {
      flex-grow: 0;
      display: flex;
      flex-direction: row;
      border-left: 1px solid rgba(black, 0.08);
      border-right: 1px solid rgba(black, 0.08);
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