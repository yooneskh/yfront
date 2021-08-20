<template>
  <v-row>
    <v-col cols="12" :md="hasAdditionalInfo ? 12 : 6">
      <v-card :loading="loading">

        <v-card-title>
          <v-icon class="me-3">mdi-ticket-confirmation</v-icon>
          ثبت تیکت جدید
        </v-card-title>

        <v-row class="ma-0 mt-n3">
          <v-col cols="12" :md="hasAdditionalInfo ? 6 : 12">
            <y-form
              :target="ticket"
              :fields="[
                {
                  key: 'category', type: 'select', title: 'دسته‌بندی',
                  items: categories.map(it => ({ value: it._id, text: it.title })),
                  rules: [v => !!v || 'دسته‌بندی الزامی است.']
                },
                {
                  key: 'title', type: 'text', title: 'موضوع',
                  rules: [
                    v => !!v || 'موضوع الزامی است.',
                    v => v.length > 5 || 'موضوع باید بیشتر از ۵ حرف داشته باشد.',
                    v => v.length < 100 || 'عنوان پیام باید کمتر از ۱۰۰ حرف داشته باشد'
                  ]
                },
                {
                  key: 'body', type: 'textarea', title: 'متن پیام',
                  rules: [
                    v => !!v || 'متن پیام الزامی است.',
                    v => v.length > 10 || 'متن پیام باید بیشتر از ۱۰ حرف داشته باشد.',
                    v => v.length < 300 || 'متن پیام باید کمتر از ۳۰۰ حرف داشته باشد.'
                  ]
                },
                {
                  key: 'files', type: 'file-array', title: 'فایل های پیام'
                }
              ]"
            />
          </v-col>
          <v-col v-if="hasAdditionalInfo" cols="12" md="6">
            <y-form
              :target="ticket.informations"
              :fields="additionalInfoFields"
            />
          </v-col>
        </v-row>

        <v-card-actions class="pt-0">
          <v-btn text color="primary" :disabled="!isTicketComplete" @click="submitTicket">
            ثبت تیکت
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-col>
  </v-row>
</template>

<script>

import { YNetwork } from 'ynetwork';

export default {
  name: 'ProfilePartTicketsNew',
  data: () => ({
    loading: false,
    ticket: {
      category: '',
      title: '',
      informations: {},
      body: '',
      files: ['']
    }
  }),
  computed: {
    selectedCategory() {
      return this.categories.find(it => it._id === this.ticket.category);
    },
    isTicketComplete() {

      const t = this.ticket;

      if (!t.category || !t.title || !t.body) return false;

      if (this.selectedCategory.fields.some(field => !t.informations[field])) return false;
      if (this.ticket.files.some(it => !it)) return false;

      return true;

    },
    hasAdditionalInfo() {
      return this.selectedCategory?.fields.length > 0;
    },
    additionalInfoFields() {

      const fields = [];

      if (this.hasAdditionalInfo) {
        fields.push(...this.selectedCategory.fields.map(field => {

          if (field === 'postalCode') return {
            key: 'postalCode', type: 'text', title: 'کد پستی',
            dir: 'ltr',
            rules: [v => !!v || 'کد پستی الزامی است.']
          };

          if (field === 'nationalCode') return {
            key: 'nationalCode', type: 'text', title: 'کد ملی',
            dir: 'ltr',
            rules: [v => !!v || 'کد ملی الزامی است.']
          };

        }));
      }

      return fields;

    }
  },
  asyncComputed: {
    categories: {
      default: [],
      async get() {

        const { status, data } = await YNetwork.get(`${this.$apiBase}/ticketcategories`);
        if (this.$generalHandle(status, data)) return [];

        return data;

      }
    }
  },
  methods: {
    async submitTicket() {

      this.loading = true;
      const { status: ticketStatus, data: ticket } = await YNetwork.post(`${this.$apiBase}/tickets/mine`, {
        category: this.ticket.category,
        title: this.ticket.title,
        informations: this.selectedCategory.fields.map(field => ({
          type: field,
          value: this.ticket.informations[field]
        }))
      });
      this.loading = false;
      if (this.$generalHandle(ticketStatus, ticket)) return;

      this.loading = true;
      const { status, data } = await YNetwork.post(`${this.$apiBase}/ticketmessages`, {
        user: this.$user._id,
        ticket: ticket._id,
        body: this.ticket.body,
        files: this.ticket.files
      });
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('تیکت شما با موفقیت ثبت شد.');
      this.$router.replace(`/profile/tickets/${ticket._id}`);

    }
  }
};

</script>
