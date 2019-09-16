export default {
  install(Vue) {
    Vue.mixin({
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
