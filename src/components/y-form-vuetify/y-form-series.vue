<template>
  <div class="y-form-series">

    <v-label>
      {{ field.title }}
      <v-btn v-if="!field.readonly && !field.disabled && !field.unaddable" class="ms-2" small icon @click="addItem">
        <v-icon small>mdi-plus</v-icon>
      </v-btn>
    </v-label>

    <v-row>
      <v-col v-for="(item, index) in target[field.key]" :key="ids[index]" class="series-item py-0" :cols="field.itemWidth || 12" :style="{ 'margin-top': index > 0 ? `${field.itemTopMargin}px` : '' }">

        <y-form
          :target="item"
          :fields="injectedItemFields"
          ref="nestedForms"
          @update:valid="$set(validations, ids[index], $event)"
          @update:key="$emit('update:key', field.key, target[field.key])"
        />

        <v-btn v-if="!field.readonly && !field.disabled" class="series-remove" icon x-small @click="removeItem(index)">
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
    ids: [],
    validations: {}
  }),
  computed: {
    injectedItemFields() {
      return this.field.itemFields.map(field => ({
        ...field,
        readonly: this.field.readonly ?? field.readonly,
        disabled: this.field.disabled ?? field.disabled
      }));
    }
  },
  watch: {
    validations: {
      deep: true,
      handler() {
        const isValid = Object.values(this.validations).every(v => v === true);
        this.$emit('update:valid', isValid);
      }
    },
    target: {
      deep: true,
      async handler() {
        if (this.target[this.field.key] && this.target[this.field.key].length !== this.ids.length) {
          this.redoIds();
        }
      }
    }
  },
  created() {

    if (!this.target[this.field.key]) {
      this.$set(this.target, this.field.key, []);
    }

    this.redoIds();

  },
  methods: {
    redoIds() {
      this.ids = this.target[this.field.key].map(() => this.$uuid());
    },
    revalidateAll() {
      this.$refs.nestedForms.forEach(it => it.revalidateAll?.());
    },
    async addItem() {

      if (!this.target[this.field.key]) {
        this.$set(this.target, this.field.key, []);
        await this.$nextTick();
      }

      this.ids.push(this.$uuid());

      this.$set(
        this.target,
        this.field.key,
        [
          ...this.target[this.field.key],
          JSON.parse(JSON.stringify(
            typeof this.field.base === 'function' ? this.field.base() : this.field.base
          ))
        ]
      );

      this.$emit('update:key', this.field.key, this.target[this.field.key]);

    },
    removeItem(index) {

      this.$set(
        this.target,
        this.field.key,
        this.target[this.field.key].filter((it, itIndex) => index !== itIndex)
      );

      this.$delete(this.validations, this.ids[index]);
      this.ids.splice(index, 1);

      this.revalidateAll();
      this.$emit('update:key', this.field.key, this.target[this.field.key]);

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
