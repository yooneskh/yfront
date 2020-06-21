export default {
  install(Vue) {
    Vue.mixin({
      methods: {
        $dialog(component, options) {
          return new Promise((resolve, reject) => {
            this.$root.dialogs.push({
              id: this.$uuid(),
              component: (Object.prototype.toString.call(component) === '[object Object]') ? component : (() => component),
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
