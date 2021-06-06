<template>
  <v-card :loading="loading" flat>

    <v-card-title>
      <v-icon class="me-3">mdi-login</v-icon>
      ورود {{ $options.Title }}
    </v-card-title>

    <auth-handler
      @update:mode="mode = $event;"
      @update:loading="loading = $event;"
      @done="$emit('resolve', true)"
    />

  </v-card>
</template>

<script>

import AuthHandler from '../components/auth-handler.vue';
import { title as Title } from '../../../../package.json'

export default {
  name: 'AuthInstantDialog',
  Title,
  components: {
    'auth-handler': AuthHandler
  },
  data: () => ({
    loading: false
  })
};

</script>
