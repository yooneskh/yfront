<template>
  <div class="y-form-element-editor">

    <v-label>{{ field.title }}</v-label>

    <v-btn depressed class="mt-2" color="primary" :disabled="field.disabled" block @click="windowOpened = true">
      باز کردن ویرایشگر
    </v-btn>

    <div class="global-window grey lighten-4 py-2 px-2" v-if="windowOpened" style="overflow-y: auto;">

      <v-toolbar class="mb-8">
        <v-toolbar-title>ویرایشگر</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon @click="windowOpened = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <y-rich-editor
        :value="value"
        @input="$emit('input', $event)"
        :placeholder="field.placeholder"
        :class="field.classes"
        :readonly="field.readonly"
        class="mb-10"
        style="width: 100%; max-width: 800px; margin: 0 auto;"
      />

    </div>

  </div>
</template>

<script>
export default {
  name: 'YFormElementEditor',
  components: {
    'y-rich-editor': require('../../y-rich-editor').default
  },
  props: {
    value: {

    },
    field: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    windowOpened: false
  })
}

</script>

<style lang="scss" scoped>
  .global-window {
    position: fixed;
    top: 0; left: 0; bottom: 0; right: 0;
    z-index: 1;
    background: grey;
  }
</style>