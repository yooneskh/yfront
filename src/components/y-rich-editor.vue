<template>
  <div class="y-rich-editor">

    <drag-container @drop="handleDrop" :drag-handle-selector="readonly ? '#non-existant-id' : '.drag-handle'">
      <drag-element v-for="(part, index) in parsedValue.parts" :key="part._id" class="editor-item">

        <h2
          v-if="part.type === 'title'"
          class="text-h5">
          <y-editable-text :value="part.title" @input="updatePart(index, { title: $event })" lazy :readonly="readonly" placeholder="جای متن شما ..." />
        </h2>

        <p v-if="part.type === 'text'">
          <y-editable-text :value="part.text" @input="updatePart(index, { text: $event })" lazy :readonly="readonly" placeholder="جای متن شما ..." />
        </p>

        <v-img
          v-if="part.type === 'image'"
          :src="part.path"
          class="my-4"
        />

        <v-card v-if="part.type === 'link'" :to="!part.link || part.link.startsWith('http') ? undefined : part.link" target="_blank" :href="part.link && part.link.startsWith('http') ? part.link : undefined" outlined class="my-4 d-flex flex-row pa-1">
          <v-img v-if="part.image" :src="part.image" contain class="me-3 flex-grow-0" height="88" width="88"/>
          <div>
            <div class="text-h6">{{ part.title }}</div>
            <div class="text-subtitle-2 font-weight-light mt-n1">{{ part.domain }}</div>
            <div class="text-body-1 mt-3" style="white-space: nowrap;">{{ part.description }}</div>
          </div>
        </v-card>

        <template v-if="part.type === 'map'">
          <l-map :zoom="part.zoom" :center="makeLatLong(part.latitude, part.longitude)" :options="{}" :style="`height: ${part.height || '300px'}`">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <l-marker :lat-lng="makeLatLong(part.latitude, part.longitude)" />
          </l-map>
        </template>

        <div class="actions-container" :style="{[$vuetify.rtl ? 'left' : 'right']: '4px'}">

          <v-btn class="drag-handle" icon small>
            <v-icon>mdi-drag</v-icon>
          </v-btn>

          <v-menu v-if="!readonly" absolute>
            <template #activator="{ on }">
              <v-btn icon color="primary" small v-on="on">
                <v-icon small>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item v-if="part.type === 'title'" @click="convertToParagraph(index)">
                <v-list-item-content>
                  <v-list-item-title>Convert to Paragraph</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="part.type === 'text'" @click="convertToTitle(index)">
                <v-list-item-content>
                  <v-list-item-title>Convert to Title</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item color="error" @click="deletePart(index)">
                <v-list-item-content>
                  <v-list-item-title class="error--text">Delete</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>

      </drag-element>
    </drag-container>

    <div v-if="!readonly" class="add-bar text-center mt-4 mx-auto grey lighten-3 py-1 px-4 mb-4" style="width: 300px; border-radius: 32px;">
      <span class="caption me-4">افزودن</span>
      <v-btn class="ms-2" icon @click="appendPart({ type: 'title', title: '' })"> <v-icon>mdi-format-title</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="appendPart({ type: 'text', text: '' })"> <v-icon>mdi-text-subject</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="addImage"> <v-icon>mdi-image</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="addLink"> <v-icon>mdi-link</v-icon> </v-btn>
      <v-btn class="ms-2" icon @click="addMap"> <v-icon>mdi-map</v-icon> </v-btn>
    </div>

  </div>
</template>

<script>

import Api from '../api';

import { Container, Draggable } from "vue-smooth-dnd";
import { latLng } from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: 'YRichEditor',
  components: {
    'y-editable-text': require('./y-editable-text').default,
    'drag-container': Container,
    'drag-element': Draggable,
    'l-map': LMap,
    'l-tile-layer': LTileLayer,
    'l-marker': LMarker
  },
  props: {
    value: {
      type: String
    },
    readonly: Boolean
  },
  computed: {
    parsedValue() {
      return JSON.parse(this.value || '{"parts":[],"config":{}}');
    }
  },
  methods: {
    appendPart(newPart) {
      this.$emit('input', JSON.stringify({
        ...this.parsedValue,
        parts: [
          ...this.parsedValue.parts,
          {
            ...newPart,
            _id: this.$uuid()
          }
        ]
      }));
    },
    updatePart(index, updates) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.map((it, itIndex) => itIndex === index ? ({ ...it, ...updates }) : it)
        })
      );
    },
    convertToParagraph(index) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.map((it, itIndex) =>
            itIndex === index ? ({ _id: this.$uuid(), type: 'text', text: it.title }) : it
          )
        })
      );
    },
    convertToTitle(index) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.map((it, itIndex) =>
            itIndex === index ? ({ _id: this.$uuid(), type: 'title', title: it.text }) : it
          )
        })
      );
    },
    deletePart(index) {
      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: this.parsedValue.parts.filter((it, itIndex) => itIndex !== index)
        })
      );
    },
    async addImage() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن تصویر',
        description: 'لطفا فایل تصویر مورد نظر را انتخاب کنید.',
        fields: [
          {
            key: 'file', type: 'file', title: 'Image',
            rules: [v => !!v || 'Image is required!']
          }
        ]
      }); if (!form || !form.file) return;

      const { status, result } = await Api.Media.loadOne(form.file);
      if (this.$generalHandle(status, result)) return;

      this.appendPart({ type: 'image', path: result.path });

    },
    async addLink() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن لینک',
        description: 'اطلاعات لینک را در زیر وارد کنید.',
        fields: [
          {
            key: 'link', type: 'text', title: 'لینک', dir: 'ltr',
            rules: [v => !!v || 'وارد کردن لینک الزامی است!']
          },
          {
            key: 'title', type: 'text', title: 'عنوان',
            rules: [v => !!v || 'وارد کردن عنوان الزامی است!']
          },
          { key: 'image', type: 'file', title: 'تصویر' },
          { key: 'domain', type: 'text', title: 'دامنه' },
          { key: 'description', type: 'textarea', title: 'توضیح' }
        ]
      }); if (!form) return;

      const { link, title, image, domain, description } = form;
      let imagePath;

      if (image) {
        const { status, result } = await Api.Media.loadOne(image);
        if (this.$generalHandle(status, result)) return;
        imagePath = result.path;
      }

      this.appendPart({ type: 'link', link, title, image: imagePath, domain, description });

    },
    async addMap() {

      const form = await this.$dialogFormMaker({
        title: 'افزودن نقشه',
        description: 'اطلاعات را برای افزودن نقشه اضافه کنید.',
        fields: [
          {
            key: 'latitude', type: 'text', title: 'Latitude', number: true, dir: 'ltr',
            rules: [v => !!v || 'Latitude الزامی است!']
          },
          {
            key: 'longitude', type: 'text', title: 'Longitude', number: true, dir: 'ltr',
            rules: [v => !!v || 'Longitude الزامی است!']
          },
          {
            key: 'zoom', type: 'text', title: 'Zoom', number: true, dir: 'ltr',
            rules: [v => !!v || 'وارد کردن میزان زوم الزامی است!']
          },
          {
            key: 'height', type: 'text', title: 'ارتفاع', dir: 'ltr'
          }
        ]
      }); if (!form) return;

      const { latitude, longitude, zoom, height } = form;

      this.appendPart({ type: 'map', latitude, longitude, zoom, height });

    },
    handleDrop(dropResult) {

      const { removedIndex, addedIndex } = dropResult;

      const array = [...this.parsedValue.parts];
      array.splice(addedIndex, 0, array.splice(removedIndex, 1)[0] );

      this.$emit(
        'input',
        JSON.stringify({
          ...this.parsedValue,
          parts: array
        })
      );

    },
    makeLatLong(latitude, longitude) {
      return latLng(latitude, longitude);
    }
  }
}
</script>

<style lang="scss" scoped>
  .y-rich-editor {

    .editor-item {
      position: relative;
      & > .actions-container {
        position: absolute;
        top: 4px;
        opacity: 0;
        z-index: 900;
      }
      &:hover .actions-container {
        opacity: 1;
      }
    }
    .add-bar .v-btn {
      cursor: pointer !important;
    }
  }
</style>