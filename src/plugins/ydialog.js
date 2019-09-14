export default {
  install (vue) {

    // TODO: add dialogs variable to $root

    vue.mixin({
      methods: {
        $dialog(component, options) {
          return new Promise((resolve, reject) => {
            this.$root.dialogs.push({
              id: this.$uuid(),
              component,
              options: options || {},
              resolve,
              reject
            });
          });
        }
      }
    });

  }
}
