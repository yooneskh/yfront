<template>
  <div class="dialog-wrapper">
    <v-dialog
      v-for="(dialog, index) in $root.dialogs"
      :key="dialog.id"
      :value="true"
      :width="dialog.options.width || 500"
      @click:outside="dialog.resolve(undefined); $root.dialogs.splice(index, 1);">

      <component
        :is="dialog.component"
        @resolve="dialog.resolve($event); $root.dialogs.splice(index, 1);"
      />

    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogWrapper'
}
</script>

<style lang="scss" scoped>
  .dialog-wrapper {
    width: 100%;
    height: 100%;
  }
</style>
