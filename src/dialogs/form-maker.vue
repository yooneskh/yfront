<template>
  <v-card>

    <v-card-title>
      {{ title || 'ورود اطلاعات' }}
    </v-card-title>

    <v-card-text class="pb-1">
      {{ description || 'لطفا اطلاعات خواسته شده را در زیر وارد کنید.' }}
    </v-card-text>

    <v-card-text class="pb-1">
      <y-form
        :valid.sync="valid"
        ref="refForm"
        :target="form"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn text :disabled="valid === false" color="primary" @click="$emit('resolve', form)">{{ actionTitle || 'ثبت' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'FormMakerDialog',
  props: {
    title: String,
    description: String,
    actionTitle: String,
    fields: Array,
    values: Object
  },
  data: () => ({
    valid: undefined,
    form: {}
  }),
  created() {
    if (this.values) {
      Object.assign(this.form, this.values);
    }
  },
  mounted() {
    if (this.fields.some(it => it.rules)) {
      this.$refs.refForm.checkValidations();
    }
  }
}
</script>