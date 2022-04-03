import { YKhFormExtended } from 'ykh-form-extended';

export default {
  name: 'YForm',
  extends: YKhFormExtended,
  components: {
    'y-form-element-resource': () => import('./y-form-elements/y-form-element-resource.vue' /* webpackChunkName: 'y-form-element-resource' */),
    'y-form-element-permissions': () => import('./y-form-elements/y-form-element-permissions.vue' /* webpackChunkName: 'y-form-element-permissions' */),
    'y-form-element-json': () => import('./y-form-elements/y-form-element-json.vue' /* webpackChunkName: 'y-form-element-json' */),
    'y-form-element-json-schema': () => import('./y-form-elements/y-form-element-json-schema.vue' /* webpackChunkName: 'y-form-element-json-schema' */),
    'y-form-element-geo': () => import('./y-form-elements/y-form-element-geo.vue' /* webpackChunkName: 'y-form-element-geo' */),
    'y-form-element-live-html': () => import('./y-form-elements/y-form-element-live-html.vue' /* webpackChunkName: 'y-form-element-live-html' */)
  }
}
