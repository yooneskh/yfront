<template>
  <v-row class="ma-0">
    <v-col cols="12" md="3" class="pa-0" style="z-index: 1">
      <v-card flat tile elevation="8" dark color="primary" class="align-center d-flex" style="height: 100vh;">
        <div class="mx-10" style="width: 100%;">

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

          <v-btn v-if="mode === 'login'" block text large @click="doLogin()">ورود به حساب کاربری</v-btn>
          <v-btn v-if="mode === 'register'" block text large @click="doRegister()">ایجاد حساب جدید</v-btn>
          <v-btn v-if="mode === 'verify'" block text large @click="doVerify()">بررسی کد تایید</v-btn>

        </div>
      </v-card>
    </v-col>
    <v-col cols="12" md="9" class="pa-0">
      <v-img src="../../assets/img/auth-background.jpg" class="v-img--darken" style="height: 100vh; position: relative;">
        <v-img src="../../assets/img/logo.png" width="52" style="position: absolute; top: 12px; left: 8px;" />
        <div class="display-2 font-weight-thin white--text" style="position: absolute; top: 72px; right: 24px;">
          به اپلیکیشن خوش آمدید!
        </div>
        <!-- <div class="caption white--text font-weight-black" style="position: absolute; left: 8px; bottom: 8px;">
          بازگشت به صفحه اصلی
        </div> -->
      </v-img>
    </v-col>
  </v-row>
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
      
      localStorage.setItem('--user--', JSON.stringify(result));
      this.$root.resetCredentials();

      this.$router.replace('/');

    }
  }
};
</script>

<style lang="scss" scoped>

</style>