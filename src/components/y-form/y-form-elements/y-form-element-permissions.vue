<template>
  <div class="y-form-element-permissions">

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <permission-selector
      v-for="permission of permissions" :key="permission[0]"
      class="my-2"
      :permission="permission"
      :value="value"
      :localize="localize"
      @input="handleInput"
    />

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

  </div>
</template>

<script>

import YFormPermissionsSelector from './components/y-form-permissions-selector.vue';

import { YNetwork } from 'ynetwork';
import { YFormElementMixin } from 'ykh-form-extended';

export default {
  name: 'YFormElementPermissions',
  components: {
    'permission-selector': YFormPermissionsSelector
  },
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    loading: false,
    permissions: [],
    locales: {}
  }),
  computed: {

  },
  mounted() {
    this.loadInfo()
  },
  methods: {
    async loadInfo() {

      this.loading = true;
      const { status, data } = await YNetwork.get(`${this.$apiBase}/auth/permissions`);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      const { permissions, locales } = data;
      this.permissions = permissions;
      this.locales = locales;

    },
    async handleInput(value) {
      this.$emit('input', value);
      await this.$nextTick();
      this.validateValue();
    },
    localize(word) {
      return this.locales[word] || word;
    }
  }
};

</script>
