<template>
  <v-container class="page" fluid>

    <v-card :loading="loading">

      <v-card-title>
        <v-icon class="me-3">mdi-ticket</v-icon>
        {{ ticket.title }}
        <v-chip class="ms-3 mt-n1" small :color="statuses[ticket.status || 'none'].color">
          <v-icon left>{{ statuses[ticket.status || 'none'].icon }}</v-icon>
          {{ statuses[ticket.status || 'none'].title }}
        </v-chip>
      </v-card-title>

      <v-card-subtitle>
        {{ ticket.category.title }} -
        ایجاد شده در <span class="d-inline-block ltred">{{ $formatTime(ticket.createdAt, 'jYYYY/jMM/jDD HH:mm') }}</span>
      </v-card-subtitle>

    </v-card>

    <v-card v-if="ticket.status && !['archived', 'deleted'].includes(ticket.status)" class="mt-2">

      <v-card-title>
        <v-icon class="me-3">mdi-plus</v-icon>
        پیام جدید
      </v-card-title>

      <v-card-text>
        <y-form
          :target="newMessage"
          :fields="[
            {
              key: 'body', type: 'textarea', title: 'متن پیام جدید',
              rules: [v => !!v || 'متن پیام الزامی است.', v => v.trim().length > 10 || 'متن پیام باید بیشتر از ۱۰ حرف داشته باشد.']
            },
            {
              key: 'files', type: 'file-array', title: 'فایل های پیام',
              itemWidth: 6
            }
          ]"
        />
      </v-card-text>

      <v-card-actions>
        <v-btn text color="primary" :disabled="!newMessage.body || newMessage.files.some(it => !it)" @click="submitMessage">
          ثبت پیام
        </v-btn>
      </v-card-actions>

    </v-card>

    <v-card
      v-for="message of messages" :key="message._id"
      class="mt-3">

      <v-card-title class="pa-3 text-body-1">

        <v-avatar size="32" class="me-3">
          <v-img :src="message.user.profile && message.user.profile.path || $userPlaceholder" />
        </v-avatar>

        {{ message.user.name }}

        <v-chip v-if="isAdmin(message)" color="primary" outlined small class="ms-2 mt-1">
          <v-icon left>mdi-face</v-icon>
          پیام مدیر
        </v-chip>

        <v-spacer />

        <span class="caption d-inline-block ltred mt-1">
          {{ $formatTime(message.createdAt, 'jYYYY/jMM/jDD HH:mm') }}
        </span>

      </v-card-title>

      <v-card-text :class="{'pt-1': isAdmin(message)}" style="white-space: pre-wrap;">{{ message.body }}</v-card-text>

      <div v-if="message.files && message.files.length > 0" class="pa-2">
        <v-btn
          v-for="file of message.files" :key="file._id"
          depressed class="me-2"
          :href="file.path" target="_blank">
          {{ file.name }}.{{ file.extension }}
        </v-btn>
      </div>

    </v-card>

  </v-container>
</template>

<script>

import { YNetwork } from 'ynetwork';

export default {
  name: 'TicketSinglePage',
  data: () => ({
    loading: false,
    ticket: {
      category: {}
    },
    messages: [],
    newMessage: {
      files: []
    },
    statuses: {
      'none': { title: '---', icon: 'mdi-clock', color: '' },
      'pending': { title: 'در حال انتظار', icon: 'mdi-clock', color: 'primary' },
      'answered': { title: 'جواب داده شده', icon: 'mdi-face', color: 'error' },
      'closed': { title: 'بسته شده', icon: 'mdi-lock', color: 'orange' },
      'archived': { title: 'بایگانی', icon: 'mdi-archive', color: 'info' },
      'deleted': { title: 'حذف شده',  icon: 'mdi-delete', color: 'error' }
    },
  }),
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {

      this.loading = true;
      const { status, data } = await YNetwork.get(`${this.$apiBase}/ticketmessages/ticket/${this.$route.params.ticketId}`);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.ticket = data.ticket;
      this.messages = data.messages.reverse();

    },
    async submitMessage() {

      this.loading = true;
      const { status, data } = await YNetwork.post(`${this.$apiBase}/ticketmessages`, {
        user: this.$user._id,
        ticket: this.$route.params.ticketId,
        body: this.newMessage.body,
        files: this.newMessage.files
      });
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('پیام جدید شما ثبت شد.');
      this.newMessage = {};
      this.loadData();

    },
    isAdmin(message) {
      return message.user._id !== this.ticket.user;
    }
  }
};

</script>