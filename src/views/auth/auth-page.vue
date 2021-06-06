<template>
  <v-row class="ma-0">
    <v-col v-if="!$isMobile" cols="12" md="4" class="pa-0" style="z-index: 1">
      <v-card flat tile elevation="12" style="height: 100vh;">
        <v-img src="../../assets/img/back-2.jpg" style="height: 100vh;" />
      </v-card>
    </v-col>
    <v-col cols="12" md="8" class="d-flex pa-0 grey lighten-3 flex-column align-center justify-center">

      <v-img src="../../assets/img/logo.png" width="80" style="position: absolute; top: 8px;" :style="{[$vuetify.rtl || $isMobile ? 'left' : 'right']: $isMobile ? '50%' : '12px', 'transform': $isMobile ? 'translateX(-50%)' : ''}" />

      <v-card max-width="350" outlined>

        <v-card-title class="justify-center">
          ورود {{ $options.Title }}
        </v-card-title>

        <auth-handler
          ref="authHandler"
          @update:loading="loading = $event"
          @update:mode="mode = $event"
          @done="$router.replace($route.query.next || '/');"
        />

      </v-card>

      <div>

        <v-btn v-if="mode === 'login' && (!isMandatory || $token)" class="mt-1" small text block>
          بازگشت به صفحه اصلی
        </v-btn>

        <v-btn v-if="mode === 'register'" class="mt-1" small text block @click="phoneNumber = ''; mode = 'login';">
          بازگشت به وارد کردن شماره تلفن
        </v-btn>

        <v-btn v-if="mode === 'verify'" class="mt-1" small text block @click="$refs.authHandler.doLogin">
          کد رو دوباره بفرست
        </v-btn>

      </div>

    </v-col>
  </v-row>
</template>

<script>

import { title as Title } from '../../../package.json';
import { Config } from '../../global/config';

import AuthHandler from './components/auth-handler.vue';

export default {
  name: 'AuthPage',
  Title,
  components: {
    'auth-handler': AuthHandler
  },
  data: () => ({
    isMandatory: Config.auth.isAuthMandatory,
    loading: false,
    mode: 'loading'
  })
};
</script>
