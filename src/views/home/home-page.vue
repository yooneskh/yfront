<template>
  <v-container class="page" fluid>

    <v-card>
      <v-card-title>صفحه اصلی</v-card-title>
      <v-card-text>

        <y-form
          :target="heh"
          :fields="[
            { key: 'name', type: 'text', title: 'نام', width: 6 },
            { key: 'counts', type: 'text', number: true, title: 'Counts', width: 6 },
            { key: 'pass', type: 'text', password: true, title: 'Password', width: 6 },
            { key: 'fruit', type: 'select', title: 'میوه‌ها', width: 6, items: ['سیب', 'موز', 'پرتقال'], multiple: false },
            { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, multiple: true, items: ['سیب', 'موز', 'پرتقال'] },
            { key: 'isMale', type: 'checkbox', title: 'دانش‌آموز هستید؟', width: 6 },
            { key: 'media', type: 'file', title: 'تصویر دانش‌آموز', width: 6 },
            { key: 'job', type: 'radios', title: 'شغل', width: 6, items: [
              { value: 'mech', text: 'مکانیک' },
              { value: 'comp', text: 'کامپیوتری' }
            ] },
            {
              key: 'freeTimes',
              type: 'series',
              title: 'زمان‌های خالی',
              width: 8,
              base: { begin: '12:00', end: '', fruits: ['سیب'] },
              itemFields: [
                { key: 'begin', type: 'text', title: 'زمان شروع', width: 3, dir: 'ltr' },
                { key: 'end', type: 'text', title: 'زمان پایان', width: 3, dir: 'ltr' },
                { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, multiple: true, items: ['سیب', 'موز', 'پرتقال'] }
              ]
            },
            {
              key: 'freeNames',
              type: 'series',
              title: 'نام‌های قابل استفاده',
              width: 4,
              base: { names: [] },
              itemFields: [
                { key: 'names', type: 'select', title: 'نام‌ها', multiple: true, addable: true },
              ]
            }
          ]"
        />

      </v-card-text>
      <v-card-actions>
        <v-btn text color="primary" class="ms-2" @click="$toast('سلااااام به تو!')">پیام بده!</v-btn>
        <v-btn text color="warning" class="ms-2" @click="$toast.warning('سلااااام به تو!')">پیام بده!</v-btn>
        <v-btn text color="error" class="ms-2" @click="$toast.error('سلااااام به تو!')">پیام بده!</v-btn>
        <v-spacer />
        <v-btn text color="error" @click="makeDialog">حذف کن</v-btn>
      </v-card-actions>
    </v-card>

    <v-card class="moveable-section mt-4" style="width: 100%; height: 300px; position: relative; overflow: auto;">
      <y-moveable v-model="boxPosition" style="background: #EAEAEA; padding: 30px; user-select: none; cursor: pointer;" >
        تکون بده!
      </y-moveable>
    </v-card>

    <v-card class="mt-4" style="width: 100%; height: 300px; overflow-y: auto;">
      <v-card-text>
        <y-rich-editor v-model="rich" />
      </v-card-text>
    </v-card>

    <v-card class="mt-4 mb-4">
      <v-card-title>نمونه جدول</v-card-title>
      <y-table
        :headers="[
          { key: 'name', text: 'نام' },
          { key: 'age', text: 'سن' },
          { key: 'time', text: 'زمان' }
        ]"
        :items="[
          { name: 'یونس خوشقدم', age: 23, time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'زهرا سادات مطلبی', age: 23, time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') }
        ]"
      />
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  components: {
    'y-moveable': () => import('../../components/y-moveable' /* webpackChunkName: 'y-moveable' */),
    'y-rich-editor': () => import('../../components/y-rich-editor' /* webpackChunkName: 'y-rich-editor' */)
  },
  data: () => ({
    heh: {
      name: '',
      isMale: true,
      fruit: 'سیب',
      fruits: [],
      media: '',
      job: 'comp',
      freeTimes: [],
      freeNames: []
    },
    rich: '-----title\nHiThereYouGoodMan\n\n-----text\nThis is the first paragraph in my own editing platform!!!! :D\n\n-----image\nhttps://p.bigstockphoto.com/GeFvQkBbSLaMdpKXF1Zv_bigstock-Aerial-View-Of-Blue-Lakes-And--227291596.jpg',
    boxPosition: [0, 0]
  }),
  methods: {
    async makeDialog() {

      const result = await this.$dialog(() => import('../../dialogs/confirm-delete'  /* webpackChunkName: 'confirm-delete-dialog' */), {
        title: 'سیستم سرمایشی'
      });

      console.log('result', result);

    },
    rand() {
      return Math.trunc(Math.random() * 10000000000);
    }
  }
};
</script>
