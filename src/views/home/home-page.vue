<template>
  <v-container class="home">

    <v-card class="mt-4">
      <v-card-title>صفحه اصلی</v-card-title>
      <v-card-text>

        <y-form
          :target="heh"
          :fields="[
            { key: 'name', type: 'text', title: 'نام', width: 6 },
            { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, items: ['سیب', 'موز', 'پرتقال'], multiple: false },
            { key: 'isMale', type: 'checkbox', title: 'دانش‌آموز هستید؟', width: 6 },
            { key: 'media', type: 'file', title: 'تصویر دانش‌آموز', width: 6 },
          ]"
        />

      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" class="ms-2" @click="$toast('سلااااام به تو!')">پیام بده!</v-btn>
        <v-spacer />
        <v-btn text color="error" @click="makeDialog">حذف کن</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="moveable-section mt-4" style="width: 100%; height: 300px; position: relative; overflow: auto;">
      <y-moveable v-model="boxPosition" style="background: #EAEAEA; padding: 30px; user-select: none; cursor: pointer;" >
        تکون بده!
      </y-moveable>
    </v-card>

    <v-card class="mt-4 mb-4">
      <v-card-title>نمونه جدول</v-card-title>
      <y-table
        :headers="[
          { key: 'name', text: 'نام' },
          { key: 'age', text: 'سن' }
        ]"
        :items="[
          { name: 'یونس خوشقدم', age: 23 },
          { name: 'یونس خوشقدم', age: 23 },
          { name: 'زهرا سادات مطلبی', age: 23 },
          { name: 'یونس خوشقدم', age: 23 },
          { name: 'یونس خوشقدم', age: 23 }
        ]"
      />
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  components: {
    'y-moveable': () => import('../../components/y-moveable' /* webpackChunkName: 'y-moveable' */)
  },
  data: () => ({
    heh: {
      name: '',
      isMale: false,
      fruits: [],
      media: ''
    },
    boxPosition: [0, 0]
  }),
  methods: {
    async makeDialog() {

      const result = await this.$dialog(() => import('../../dialogs/confirm-delete'  /* webpackChunkName: 'confirm-delete-dialog' */), {
        title: 'سیستم سرمایشی'
      });

      console.log('result', result);

    }
  }
};
</script>
