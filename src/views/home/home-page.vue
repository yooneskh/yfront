<template>
  <v-container class="home">

    <v-card>
      <v-card-text>

        <h3 class="display-2">صفحه  اصلی</h3>

        <y-form
          :target="heh"
          :fields="[
            { key: 'name', type: 'text', title: 'نام', width: 6 },
            { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, items: ['سیب', 'موز', 'پرتقال'], multiple: false },
            { key: 'isMale', type: 'checkbox', title: 'دانش‌آموز هستید؟', width: 6 },
            { key: 'media', type: 'file', title: 'تصویر دانش‌آموز', width: 6 },
          ]"
        />

        <v-btn @click="makeDialog">حذف کن</v-btn>

      </v-card-text>
    </v-card>

    <v-card class="moveable-section mt-4" style="width: 100%; height: 300px; position: relative; overflow: auto;">
      <y-moveable v-model="boxPosition" style="background: #EAEAEA; padding: 30px; user-select: none; cursor: pointer;" >
        تکون بده!
      </y-moveable>
    </v-card>

    <v-card class="mt-4 mb-8">
      <y-table
        :headers="[
          { value: 'name', text: 'نام' },
          { value: 'age', text: 'سن' }
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
    'y-moveable': () => import('../../components/y-moveable.vue' /* webpackChunkName: 'y-moveable' */),
    'y-table': () => import('../../components/y-table' /* webpackChunkName: 'y-table' */)
  },
  data: () => ({
    heh: {
      name: '',
      isMale: false,
      fruits: [],
      media: {}
    },
    boxPosition: [0, 0]
  }),
  methods: {
    async makeDialog() {
      
      const result = await this.$dialog(() => import('../../dialogs/confirm-delete.vue'  /* webpackChunkName: 'confirm-delete-dialog' */), {
        title: 'سیستم سرمایشی'
      });

      console.log('result', result);

    }
  }
};
</script>
