<template>
  <v-container class="pb-10" style="max-width: 100%; background: #EAEAEA" fill-height>
    <div v-if="loading" class="text-center" style="width: 100%;">

      <v-progress-circular class="mt-12" indeterminate size="40" color="primary" />
      <p class="mt-4">در حال بررسی پرداخت ...</p>

    </div>
    <v-card v-else width="400" class="mx-auto my-6 text-center">

      <v-card-title class="white--text justify-center" :class="{[`${ success ? 'success' : 'error' }`]: true}">خرید {{ success ? 'موفق' : 'ناموفق' }}!</v-card-title>

      <v-card-text v-if="success" class="py-4 pb-0 mt-4">
        پرداخت
      </v-card-text>

      <v-card-text v-if="success" class="pt-2" style="font-size: 2rem">
        {{ amount }} تومان
      </v-card-text>

      <v-card-text v-if="success" class="pb-0">
        برای
      </v-card-text>
      
      <v-card-text v-if="success" class="pt-1" style="font-size: 2rem; line-height: 2.5rem;">
        {{ title }}
      </v-card-text>

      <v-card-text class="success--text" v-if="success">با موفقیت انجام شد!</v-card-text>
      <v-card-text class="error--text mt-8" v-else>خرید با موفقیت انجام نشد. مبلغ به زودی به حساب شما باز‌میگردد. در صورت نیاز می‌توانید با پشتیبانی تماس بگیرید.</v-card-text>

      <v-card-actions>
        <v-btn text large block to="/">بازگشت به صفحه اصلی</v-btn>
      </v-card-actions>

    </v-card>
  </v-container>
</template>

<script>

import Api from '../../api';

export default {
  name: 'VerifyPaymentPage',
  data: () => ({
    loading: true,
    success: false,
    amount: 0,
    title: ''
  }),
  mounted() {
    this.verify();
  },
  methods: {
    async verify() {

      this.loading = true;
      const { status, result } = await Api.Payment.verifyTicket(this.$route.query.ticket);
      this.loading = false;

      if (this.$generalHandle(status, result)) return;

      this.success = true;

      this.amount = result.amount;
      this.title = result.factorTitle;

    }
  }
};

</script>

<style lang="scss" scoped>
  .evaluate {
    position: relative;
    height: 250px;
    .infopart {
      position: absolute;
      right: 0;
      left: 116px;
      top: 80px;
    }
    .image {
      position: absolute;
      top: 20px;
      left: -100px
    }
  }
  .horizontal-list {
    white-space: nowrap;
    overflow-x: auto;
    & > div {
      display: inline-block;
    }
  }
</style>