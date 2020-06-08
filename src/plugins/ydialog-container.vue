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
        v-bind="dialog.options"
        @resolve="dialog.resolve($event); $root.dialogs.splice(index, 1);"
        @update:width="dialog.options.width = $event"
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
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
  }
</style>
