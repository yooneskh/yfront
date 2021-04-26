<template>
  <div>
    <v-label>{{ field.title }}</v-label>
    <permission-selector
      v-for="permission of permissions" :key="permission[0]"
      class="my-2"
      :permission="permission"
      :value="value"
      :localize="localize"
      @input="handleInput"
    />
  </div>
</template>

<script>

import YFormPermissionsSelector from './components/y-form-permissions-selector.vue';

import YNetwork from 'ynetwork';
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
      const { status, result } = await YNetwork.get(`${this.$apiBase}/auth/permissions`);
      this.loading = false;
      if (this.$generalHandle(status, result)) return;

      const { permissions, locales } = result;
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
