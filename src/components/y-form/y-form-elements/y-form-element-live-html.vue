<template>
  <div class="y-form-element-live-html">

    <label
      class="v-label"
      :class="{ 'error--text': field.error, 'success--text': field.success }">
      {{ field.title }}
    </label>

    <div>
      <v-btn color="primary" depressed block @click="liveIsOpened = true;">
        Launch Live Html Editor
      </v-btn>
    </div>

    <div v-if="field.hint" class="caption mt-1 ms-2">
      {{ typeof field.hint === 'function' ? field.hint(value) : field.hint }}
    </div>

    <transition name="slide-from-up">
      <div v-if="field.message" class="caption mt-1 ms-2" :class="{ 'error--text': field.error, 'success--text': field.success }">
        {{ field.message }}
      </div>
    </transition>

    <v-fade-transition>
      <v-sheet v-if="liveIsOpened" class="d-flex flex-column" style="position: fixed; inset: 0; z-index: 999;">

        <v-toolbar class="flex-grow-0">

          <v-toolbar-title>
            Live Html Editor
          </v-toolbar-title>

          <v-spacer />

          <v-toolbar-items>
            <v-btn text @click="liveIsOpened = false;">
              <v-icon>
                mdi-close
              </v-icon>
            </v-btn>
          </v-toolbar-items>

        </v-toolbar>

        <div class="d-flex flex-row flex-grow-1 pa-2" style="height: 0; gap: 8px;">

          <v-textarea
            hide-details
            :value="value"
            @input="handleInput"
            outlined
            rows="18"
            class="flex-grow-1"
            style="width: 0; height: 100%;"
          />

          <iframe
            :src="'data:text/html;charset=utf-8,' + value"
            frameborder="0"
            class="flex-grow-1"
            style="width: 0;"
          />

        </div>

      </v-sheet>
    </v-fade-transition>

  </div>
</template>

<script>

import { YFormElementMixin } from 'ykh-form-extended';


export default {
  name: 'YFormElementLiveHtml',
  props: {
    value: { },
    field: {
      type: Object,
      required: true
    }
  },
  mixins: [YFormElementMixin],
  data: () => ({
    liveIsOpened: false
  }),
  methods: {
    async handleInput(value) {
      this.$emit('input', value);
      await this.$nextTick();
      this.validateValue();
    }
  }
};

</script>
