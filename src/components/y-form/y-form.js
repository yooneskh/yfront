import { YKhFormExtended } from 'ykh-form-extended';

export default {
  name: 'YForm',
  extends: YKhFormExtended,
  components: {
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */),
    'y-form-element-permissions': () => import('./y-form-elements/y-form-element-permissions.vue' /* webpackChunkName: 'y-form-element-permissions' */)
  }
}
