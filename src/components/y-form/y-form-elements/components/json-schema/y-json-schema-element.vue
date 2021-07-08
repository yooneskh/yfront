<template>
  <div class="y-json-schema-element ltred">

    <div class="item-config">

      <span v-if="!isRoot" class="caption">

        <y-editable-text
          :value="value.key"
          lazy
          @input="updateSchema('key', $event)"
        />

        :
      </span>

      <!-- type selection -->
      <v-menu offset-x offset-y :close-on-content-click="false">

        <template #activator="{ on }">
          <v-btn x-small text class="ml-2" v-on="on">
            {{ value.type }} {{ value.type === 'array' ? `[${value.subtype || '---' }]` : '' }}
          </v-btn>
        </template>

        <v-sheet flat class="pa-1 ltred pr-0">

          <div class="main-types">
            <v-btn
              v-for="type of types"
              :key="type"
              small class="mr-1"
              :text="type !== value.type"
              :depressed="type === value.type"
              :color="type === value.type ? 'primary' : undefined"
              @click="updateSchema('type', type)">
              {{ type }}
            </v-btn>
          </div>

          <div v-if="value.type === 'array'" class="sub-types mt-1">
            <v-btn
              v-for="type of types"
              :key="type"
              small class="mr-1"
              :text="type !== value.subtype"
              :depressed="type === value.subtype"
              :color="type === value.subtype ? 'primary' : undefined"
              @click="updateSchema('subtype', type)">
              {{ type }}
            </v-btn>
          </div>

        </v-sheet>

      </v-menu>

      <v-btn v-if="value.type === 'object'" icon x-small class="ml-1" @click="addChild">
        <v-icon x-small>mdi-plus</v-icon>
      </v-btn>

    </div>

    <div v-if="value.children && value.children.length > 0" class="children pl-8">
      <YJsonSchemaElement
        v-for="(child, index) of value.children"
        :key="child.key"
        class="py-1"
        :value="child"
        @input="handleChildChange(index, $event)"
      />
    </div>

  </div>
</template>

<script>

import { YEditableText } from 'ykh-form-extended';

export default {
  name: 'YJsonSchemaElement',
  components: {
    'y-editable-text': YEditableText
  },
  props: {
    value: {},
    isRoot: Boolean
  },
  data: () => ({
    types: ['object', 'array', 'string', 'number', 'boolean']
  }),
  methods: {
    updateSchema(key, value) {

      const newValue = { ...this.value };
      newValue[key] = value;

      if (key === 'type') newValue.children = [];

      this.$emit('input', newValue);

    },
    addChild() {

      const currentChildren = this.value.children ?? [];

      this.updateSchema(
        'children',
        [
          ...currentChildren,
          {
            key: `Key ${currentChildren.length + 1}`,
            type: 'string'
          }
        ]
      );

    },
    handleChildChange(index, newChild) {

      const children = [...this.value.children];
      children[index] = newChild;

      this.updateSchema('children', children);

    }
  }
};

</script>