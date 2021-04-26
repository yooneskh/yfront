<template>
  <v-expansion-panels flat class="rounded-sm" style="border: 1px solid rgba(0, 0, 0, 0.169)">
    <v-expansion-panel>

      <v-expansion-panel-header class="py-2 px-4" style="min-height: unset;" :expand-icon="isAllChildsSelected ? '' : undefined">

        <v-checkbox
          class="ma-0 me-3 flex-grow-0"
          hide-details
          :input-value="isAllChildsSelected"
          @click.stop="toggleAllChilds"
        />

        {{ localize(permission[0]) }}

      </v-expansion-panel-header>

      <v-expansion-panel-content v-if="!isAllChildsSelected" class="mx-n2">
        <div v-for="(child, index) of permission.slice(1)" :key="index">

          <v-checkbox
            v-if="typeof child === 'string'"
            hide-details
            :label="localize(child)"
            :input-value="value && value.includes(makeChildPermit(child))"
            @click="toggleChild(child)"
          />

          <YFormPermissionsSelector
            v-else
            class="my-2"
            :permission="child"
            :localize="localize"
            :value="value"
            :parent-chain="parentChain ? `${parentChain}.${permission[0]}` : `${permission[0]}`"
            @input="$emit('input', $event)"
          />

        </div>
      </v-expansion-panel-content>

    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  name: 'YFormPermissionsSelector',
  props: {
    permission: {},
    localize: {},
    value: {},
    parentChain: {
      type: String,
      default: ''
    }
  },
  computed: {
    allChildsPermission() {
      return `${ this.parentChain ? `${this.parentChain}.` : '' }${this.permission[0]}.*`;
    },
    isAllChildsSelected() {
      return this.value && this.value.includes(this.allChildsPermission)
    },
  },
  methods: {
    toggleAllChilds() {
      if (this.isAllChildsSelected) {
        this.$emit('input', this.value.filter(it => it !== this.allChildsPermission));
      }
      else {
        this.$emit('input', [ ...(this.value || []), this.allChildsPermission ]);
      }
    },
    makeChildPermit(child) {
      return `${ this.parentChain ? `${this.parentChain}.` : '' }${this.permission[0]}.${child}`;
    },
    toggleChild(child) {

      const permit = this.makeChildPermit(child);

      if (this.value && this.value.includes(permit)) {
        this.$emit('input', this.value.filter(it => it !== permit));
      }
      else {
        this.$emit('input', [ ...(this.value || []), permit ]);
      }

    },
  }
}
</script>
