<template>
  <v-container bg fill-height>
    <v-layout row wrap align-center>
      <v-flex class="px-4">
        
        <v-card max-width="385" class="mx-auto" outlined :loading="loading">
          <v-card-title class="text-center">ورود به اپلیکیشن</v-card-title>
          <v-card-text class="pt-0 pb-0 px-4">

            <y-form
              v-if="mode === 'login'"
              :target="this"
              no-padding
              :fields="[
                { key: 'phoneNumber', type: 'text', title: 'شماره تلفن', classes: 'ltred'}
              ]"
            />

            <y-form
              v-if="mode === 'register'"
              :target="this"
              no-padding
              :fields="[
                { key: 'firstName', type: 'text', title: 'نام'},
                { key: 'lastName', type: 'text', title: 'نام خانوادگی'}
              ]"
            />

            <y-form
              v-if="mode === 'verify'"
              :target="this"
              no-padding
              :fields="[
                { key: 'verificationCode', type: 'text', title: 'کد تایید', classes: 'ltred'}
              ]"
            />

          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn v-if="mode === 'login'" block large color="primary" @click="doLogin()">ورود به حساب کاربری</v-btn>
            <v-btn v-if="mode === 'register'" block large color="primary" @click="doRegister()">ایجاد حساب جدید</v-btn>
            <v-btn v-if="mode === 'verify'" block large color="primary" @click="doVerify()">بررسی کد تایید</v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

import Api from '../../api';

export default {
  name: 'AuthPage',
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
      
      localStorage.setItem('--user--', JSON.stringify(result.user));
      this.$root.resetCredentials();

      this.$router.replace('/home');

    }
  }
};
</script>

<style lang="scss" scoped>

</style>