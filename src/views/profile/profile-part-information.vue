<template>
  <v-row dense>
    <v-col cols="12" md="6">
      <v-card :loading="loading">

        <v-card-title>
          <v-icon class="me-3">mdi-account</v-icon>
          اطلاعات پایه
        </v-card-title>

        <v-card-text>
          <y-form
            :target="info"
            :valid.sync="isValid"
            :fields="[
              {
                key: 'name', type: 'text', title: 'نام',
                rules: [v => !!v || 'نام الزامی اتس!']
              },
              {
                key: 'phoneNumber', type: 'text', title: 'شماره تلفن',
                dir: 'ltr', disabled: true
              },
              {
                key: 'email', type: 'text', title: 'ایمیل',
                dir: 'ltr'
              },
              {
                key: 'profile', type: 'file', title: 'تصویر پروفایل'
              }
            ]"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn text color="primary" :disabled="!isValid || JSON.stringify(info) === JSON.stringify($user)" @click="submitInfo">
            ثبت اطلاعات پایه
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { YNetwork } from 'ynetwork';

export default {
  name: 'ProfilePartInformation',
  data: () => ({
    loading: false,
    info: {},
    isValid: true
  }),
  created() {
    this.info = JSON.parse(JSON.stringify(this.$user));
    this.info.profile = this.info.profile?._id;
  },
  methods: {
    async submitInfo() {

      const { name, email, profile } = this.info;

      this.loading = true;
      const { status, data } = await YNetwork.patch(`${this.$apiBase}/auth/identity`, { name, email, profile })
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('اطلاعات با موفقیت ثبت شد.');

      this.$user.name = name;
      this.$user.email = email;
      // this.$user.profile = profile; // todo: fix media loading for profile

    }
  }
};

</script>
