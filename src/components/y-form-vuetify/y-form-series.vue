<template>
  <div class="y-form-series">

    <v-subheader class="px-0">
      {{ field.title }}
      <v-btn class="ms-2" small icon @click="addItem">
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </v-subheader>

    <v-row>
      <v-col v-for="(item, index) in target[field.key]" :key="ids[index]" class="series-item py-0" :cols="field.itemWidth || 12" :style="{ 'margin-top': index > 0 ? `${field.itemTopMargin}px` : '' }">

        <y-form
          :target="item"
          :fields="field.itemFields"
        />

        <v-btn class="series-remove" icon x-small @click="removeItem(index)">
          <v-icon color="error" x-small>mdi-close</v-icon>
        </v-btn>

      </v-col>
    </v-row>

  </div>
</template>

<script>
export default {
  name: 'YFormSeries',
  components: {
    'y-form': require('./y-form-vuetify').default
  },
  props: {
    target: {
      type: Object,
      required: true
    },
    field: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    ids: []
  }),
  mounted() {
    this.ids = this.target[this.field.key].map(() => this.$uuid())
  },
  methods: {
    addItem() {
      this.ids.push(this.$uuid());
      this.target[this.field.key].push(JSON.parse(JSON.stringify(this.field.base)));
    },
    removeItem(index) {
      this.target[this.field.key].splice(index, 1);
      this.ids.splice(index, 1);
    }
  }
}
</script>

<style lang="scss" scoped>
  .series-item {
    position: relative;
    .series-remove {
      position: absolute;
      top: 0px;
      left: 8px;
      opacity: 0;
      pointer-events: none;
      transition: all 0.2s ease-in-out;
    }
  }
  .series-item:hover .series-remove {
    opacity: 1;
    pointer-events: all;
  }
</style>