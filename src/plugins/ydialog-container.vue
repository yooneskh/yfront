<template>
  <div class="dialog-wrapper">
    <v-dialog
      v-for="(dialog, index) in $root.dialogs"
      :key="dialog.id"
      :value="true"
      :width="dialog.options.width || 500"
      :dark="dialog.options.dialogDark"
      :fullscreen="dialog.options.dialogFullscreen"
      :light="dialog.options.dialogLight"
      :open-on-focus="dialog.options.dialogOpenOnFocus"
      :open-on-hover="dialog.options.dialogOpenOnHover"
      :origin="dialog.options.dialogOrigin"
      :overlay-color="dialog.options.dialogOverlayColor"
      :overlay-opacity="dialog.options.dialogOverlayOpacity"
      :persistent="dialog.options.dialogPersistent"
      :transition="dialog.options.dialogTransition"
      @click:outside="dialog.resolve(undefined); $root.dialogs.splice(index, 1);"
      @keydown.esc="dialog.resolve(undefined); $root.dialogs.splice(index, 1);">
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
  name: 'DialogWrapper',
  mounted() {
    window.addEventListener('popstate', this.handleBrowserBackButton);
  },
  beforeDestroy() {
    window.removeEventListener('popstate', this.handleBrowserBackButton);
  },
  methods: {
    handleBrowserBackButton() {
      for (const dialog of this.$root.dialogs) {
        dialog.resolve(undefined);
      } this.$root.dialogs = [];
    }
  }
}
</script>

<style lang="scss" scoped>
  .dialog-wrapper {
    position: fixed;
    top: 0; bottom: 0;
    left: 0; right: 0;
  }
</style>
