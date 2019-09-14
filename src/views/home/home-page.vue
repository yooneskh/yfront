<template>
  <v-container class="home">
    <h3 class="display-2">صفحه اصلی</h3>
    <y-form
      :target="heh"
      :fields="[
        { key: 'name', type: 'text', title: 'نام', width: 6 },
        { key: 'isMale', type: 'checkbox', title: 'دانش‌آموز هستید؟', width: 6 },
        { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, items: ['سیب', 'موز', 'پرتقال'], multiple: false },
        { key: 'media', type: 'file', title: 'تصویر دانش‌آموز', width: 6 },
      ]"
    />
    <v-btn large @click="makeDialog">حذف کن</v-btn>
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  data: () => ({
    heh: {
      name: '',
      isMale: false,
      fruits: [],
      media: {}
    }
  }),
  methods: {
    async makeDialog() {
      
      const result = await this.$dialog(() => import('../../dialogs/confirm-delete.vue'), {
        title: 'سیستم سرمایشی'
      });

      console.log('result', result);

    }
  }
};
</script>
