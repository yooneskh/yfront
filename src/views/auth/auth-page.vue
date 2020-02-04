<template>
  <v-row class="ma-0">
    <v-col v-if="!$isMobile" cols="12" md="4" class="pa-0" style="z-index: 1">
      <v-card flat tile elevation="12" style="height: 100vh;">
        <v-img src="../../assets/img/back-2.jpg" style="height: 100vh;" />
      </v-card>
    </v-col>
    <v-col cols="12" md="8" class="d-flex pa-0 grey lighten-3 flex-column align-center justify-center">
      
      <v-img src="../../assets/img/logo.png" width="80" style="position: absolute; top: 8px;" :style="{'left': $isMobile ? '50%' : '12px', 'transform': $isMobile ? 'translateX(-50%)' : ''}" />
      
      <v-card max-width="350" outlined>

        <v-card-title class="justify-center">ورود {{ $options.Title }}</v-card-title>

        <v-card-text class="mt-4">

          <template v-if="mode === 'login'">
            شماره تلفن خود را در زیر وارد کنید تا به حساب خود وارد شوید.
            <y-form
              class="pt-2"
              :target="this"
              no-padding
              :fields="[
                { key: 'phoneNumber', type: 'text', title: 'شماره تلفن', classes: 'ltred', hideDetails: true }
              ]"
            />
          </template>

          <template v-if="mode === 'register'">
            شما قبلا حساب کاربری نساخته‌اید. لطفا اطلاعات زیر را وارد کرده تا حساب شما ساخته شود.
            <y-form
              class="pt-2"
              :target="this"
              no-padding
              :fields="[
                { key: 'firstName', type: 'text', title: 'نام' },
                { key: 'lastName', type: 'text', title: 'نام خانوادگی', hideDetails: true }
              ]"
            />
          </template>

          <template v-if="mode === 'verify'">
            کد تایید به شماره شما فرستاده شده است. لطفا آن را در زیر وارد کنید.
            <y-form
              class="pt-2"
              :target="this"
              no-padding
              :fields="[
                { key: 'verificationCode', type: 'text', title: 'کد تایید', classes: 'ltred', hideDetails: true }
              ]"
            />
          </template>

        </v-card-text>

        <div class="mt-4 px-2 pb-2">
          <template v-if="mode === 'login'">
            <v-btn block depressed color="primary" large :loading="loading" @click="doLogin">ورود به حساب کاربری</v-btn>
          </template>
          <template v-if="mode === 'register'">
            <v-btn block depressed color="primary" large :loading="loading" @click="doRegister">ایجاد حساب جدید</v-btn>
          </template>
          <template v-if="mode === 'verify'">
            <v-btn block depressed color="primary" large :loading="loading" @click="doVerify">بررسی کد تایید</v-btn>
          </template>
        </div>

      </v-card>

      <div>
        <template v-if="mode === 'login'">
          <v-btn class="mt-1" small text block>بازگشت به صفحه اصلی</v-btn>
        </template>
        <template v-if="mode === 'register'">
          <v-btn class="mt-1" small text block @click="phoneNumber = ''; mode = 'login';">بازگشت به وارد کردن شماره تلفن</v-btn>
        </template>
        <template v-if="mode === 'verify'">
          <v-btn class="mt-1" small text block @click="doLogin">کد رو دوباره بفرست</v-btn>
        </template>
      </div>

    </v-col>
  </v-row>
</template>

<script>

import Api from '../../api';
import { title as Title } from '../../../package.json';

export default {
  name: 'AuthPage',
  Title,
  data: () => ({
    mode: 'login',
    loading: false,
    phoneNumber: '',
    firstName: '',
    lastName: '',
    verificationCode: ''
  }),
  methods: {
    async doLogin() {

      this.loading = true;
      const { status, result } = await Api.Auth.login(`+98${this.phoneNumber.slice(1)}`);
      this.loading = false;

      if (status === 404) this.mode = 'register';
      else if (this.$generalHandle(status, result)) return;
      else this.mode = 'verify';

    },
    async doRegister() {

      this.loading = true;
      const { status, result } = await Api.Auth.register(`+98${this.phoneNumber.slice(1)}`, this.firstName, this.lastName);
      this.loading = false;

      if (this.$generalHandle(status, result)) return;
      
      this.mode = 'verify';

    },
    async doVerify() {

      this.loading = true;
      const { status, result } = await Api.Auth.verify(`+98${this.phoneNumber.slice(1)}`, this.verificationCode);
      this.loading = false;

      if (this.$generalHandle(status, result)) return;
      
      localStorage.setItem('--user--', JSON.stringify(result));
      this.$root.resetCredentials();

      this.$router.replace('/');

    }
  }
};
</script>

<style lang="scss" scoped>

</style>