<template>
  <v-container class="page" fluid>

    <v-card>
      <v-card-title>صفحه اصلی</v-card-title>

      <v-card-text>
        <y-form
          :target="heh"
          :fields="[
            { key: 'name', type: 'text', title: 'نام', width: 6 },
            { key: 'counts', type: 'text', number: true, title: 'تعداد', width: 6 },
            { key: 'pass', type: 'text', password: true, title: 'رمز عبور', width: 6 },
            { key: 'fruits', type: 'select', title: 'میوه‌ها', width: 6, multiple: true, items: ['سیب', 'موز', 'پرتقال'] },
            { key: 'media', type: 'file', title: 'تصویر دانش‌آموز', width: 6 },
            { key: 'isMale', type: 'checkbox', title: 'دانش‌آموز هستید؟', width: 6 },
            { key: 'from', type: 'date', title: 'تاریخ ورود', labelFormat: 'jDD jMMMM jYYYY', width: 6 },
            { key: 'body', type: 'editor', title: 'متن تاریخی', width: 6 },
            { key: 'bodies', type: 'textarea', title: 'متن کمتر تاریخی', width: 6 },
            { key: 'job', type: 'radios', title: 'شغل', width: 6, items: [
              { value: 'mech', text: 'مکانیک' },
              { value: 'comp', text: 'کامپیوتری' }
            ] },
            { key: 'newJob', type: 'radios', title: 'شغل جدید', width: 6, horizontal: true, items: [
              { value: 'mech', text: 'مکانیک' },
              { value: 'comp', text: 'کامپیوتری' }
            ] },
            { key: 'items', type: 'checkboxes', title: 'آیتم‌ها', width: 6, items: [
              { value: 'mech', text: 'مکانیک' },
              { value: 'comp', text: 'کامپیوتری' }
            ] },
            { key: 'newItems', type: 'checkboxes', title: 'آیتم‌های جدید', horizontal: true, width: 6, items: [
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

    <v-card class="mt-4 mb-4">
      <v-card-title>نمونه جدول</v-card-title>
      <y-table
        :headers="[
          { key: 'name', text: 'نام' },
          { key: 'age', text: 'سن' },
          { key: 'uuid', text: 'کد ویژه' },
          { key: 'time', text: 'زمان' }
        ]"
        :items="[
          { name: 'یونس خوشقدم', age: 23, uuid: $uuid(), time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, uuid: $uuid(), time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'زهرا سادات مطلبی', age: 23, uuid: $uuid(), time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, uuid: $uuid(), time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') },
          { name: 'یونس خوشقدم', age: 23, uuid: $uuid(), time: $formatTime(Date.now() - rand(), 'jYYYY/jMMMM/jDD HH:mm:ss') }
        ]"
      />
    </v-card>

  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  components: {
    'y-moveable': require('../../components/y-moveable').default
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
      freeNames: [],
      items: []
    },
    boxPosition: [0, 0]
  }),
  methods: {
    async makeDialog() {
      await this.$dialogConfirmDelete('سیستم سرمایشی');
    },
    rand() {
      return Math.trunc(Math.random() * 10000000000);
    }
  }
};
</script>
