<template>
  <v-card :loading="loading">

    <v-card-title>
      <v-icon class="me-3">mdi-ticket-account</v-icon>
      تیکت‌های من
    </v-card-title>

    <v-tabs :color="statuses.find(it => it.status === currentStatus).color">
      <v-tab
        v-for="status of statuses" :key="status.status"
        :color="status.color"
        @click="currentStatus = status.status"
        style="letter-spacing: 0;">

        <v-icon class="me-3">{{ status.icon }}</v-icon>
        {{ status.title }}

        <v-chip v-if="tickets[status.status]" small dark :color="status.color" class="ms-2" style="pointer-events: none'">
          {{ tickets[status.status].length }}
        </v-chip>

      </v-tab>
    </v-tabs>

    <y-table
      :headers="[
        { key: 'category', text: 'دسته‌بندی' },
        { key: 'title', text: 'موضوع' },
        { key: 'createdAt', text: 'زمان ایجاد' },
        { key: 'updatedAt', text: 'زمان آخرین تغییر' }
      ]"
      :items="tickets[currentStatus] || []"
      :actions="tableActions"
      @archive="changeTicketStatus($event, 'archived')"
      @delete="changeTicketStatus($event, 'deleted')">

      <template #item-category="{ data }">
        {{ data && data.title }}
      </template>

      <template #item-createdAt="{ data }">
        {{ $formatTime(data, 'jDD jMMMM jYYYY hh:mm') }}
      </template>

      <template #item-updatedAt="{ data }">
        {{ !data ? '---' : $formatTime(data, 'jDD jMMMM jYYYY hh:mm') }}
      </template>

    </y-table>
  </v-card>
</template>

<script>

import { YNetwork } from 'ynetwork';
import groupBy from 'lodash/groupBy';

export default {
  name: 'ProfilePartTicketsList',
  data: () => ({
    loading: false,
    tickets: [],
    statuses: [
      { status: 'pending', title: 'در حال انتظار', icon: 'mdi-clock', color: 'primary' },
      { status: 'answered', title: 'جواب داده شده', icon: 'mdi-face', color: 'error' },
      { status: 'closed', title: 'بسته شده', icon: 'mdi-lock', color: 'orange' },
      { status: 'archived', title: 'بایگانی', icon: 'mdi-archive', color: 'info' },
      { status: 'deleted', title: 'حذف شده',  icon: 'mdi-delete', color: 'error' },
    ],
    currentStatus: 'pending'
  }),
  computed: {
    tableActions() {

      if (['archived', 'deleted'].includes(this.currentStatus)) {
        return [
          { key: 'view', icon: 'mdi-eye', tooltip: 'مشاهده', link: it => `/profile/tickets/${it._id}` }
        ];
      }

      return [
        { key: 'view', icon: 'mdi-eye', tooltip: 'مشاهده', link: it => `/profile/tickets/${it._id}` },
        { key: 'archive', icon: 'mdi-archive', tooltip: 'بایگانی', color: 'info' },
        { key: 'delete', icon: 'mdi-delete', tooltip: 'حذف', color: 'error' }
      ];

    }
  },
  created() {
    this.loadInfo();
  },
  methods: {
    async loadInfo() {

      this.loading = true;
      const { status, data } = await YNetwork.get(`${this.$apiBase}/tickets/mine/list`);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.tickets = groupBy(data, 'status');

    },
    async changeTicketStatus(ticket, newStatus) {

      this.loading = true;
      const { status, data } = await YNetwork.patch(`${this.$apiBase}/tickets/mine/${ticket._id}`, { status: newStatus });
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('وضعیت با موفقیت تغییر کرد.');
      this.loadInfo();

    }
  }
};

</script>
