<template>
  <v-card>

    <v-card-title>
      {{ title || 'ورود اطلاعات' }}
    </v-card-title>

    <v-card-text class="pb-1">
      لطفا اطلاعات خواسته شده را در زیر وارد کنید.
    </v-card-text>

    <v-card-text class="pb-1">
      <y-form
        :target="form"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn text @click="$emit('resolve', form)">{{ actionTitle || 'ثبت' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'FormMakerDialog',
  props: {
    title: String,
    actionTitle: String,
    fields: Array,
    values: Object
  },
  data: () => ({
    form: {}
  }),
  created() {
    if (this.values) {
      Object.assign(this.form, this.values);
    }
  }
}
</script>

<style>

</style>