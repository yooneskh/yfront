<template>
  <y-form
    :target="bag"
    no-bottom-padding
    :fields="[
      {
        key: 'files', type: 'series', title: field.title,
        base: { file: '' }, itemFields: [
          {
            key: 'file', type: 'file', title: 'File',
            getter: (target, index) => bag.files[index] ? bag.files[index].file : undefined
          }
        ]
      }
    ]"
  />
</template>

<script>

import { YFormElementMixin } from '../mixins/y-form-element-mixin';

export default {
  name: 'YFormElementText',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  watch: {
    bag: {
      deep: true,
      async handler() {
        await this.$nextTick();
        this.$emit('input', this.bag.files.map(it => it.file));
        await this.$nextTick();
        this.validateValue();
      }
    },
    value: {
      deep: true,
      async handler() {

        const bagValue = (this.value || []).map(it => ({ file: it }));

        if (JSON.stringify(this.bag.files) !== JSON.stringify(bagValue)) {
          this.bag.files = bagValue;
        }

      }
    },
  },
  created() {
    if (this.value) {
      this.bag.files = this.value.map(it => ({ file: it }));
    }
  },
  data: () => ({
    bag: {
      files: []
    }
  })
};

</script>
