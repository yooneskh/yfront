<template>
  <v-container class="home-page">
    <h3 class="display-2">Home Page</h3>
    <y-form
      :target="heh"
      :fields="[
        { key: 'name', type: 'text', title: 'Name', width: 6 },
        { key: 'isMale', type: 'checkbox', title: 'Male?', width: 6 },
        { key: 'fruits', type: 'select', title: 'Fruits', width: 6, items: ['Apple', 'Banana', 'Orange'], multiple: false },
        { key: 'media', type: 'file', title: 'Media Picture', width: 6 },
      ]"
    />
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',
  data: () => ({
    heh: {
      name: '',
      isMale: false,
      fruits: [],
      media: {}
    }
  })
};
</script>
