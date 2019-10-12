<template>
  <v-container fluid bg fill-height style="background-color: #EAEAEA">
    <v-layout row wrap align-center>
      <v-flex class="px-4 text-center">
        
        <h1 class="text-error">صفحه مورد نظر شما موجود نیست!</h1>

        <v-btn class="mt-6" large color="error" to="/">بریم به صفحه اصلی!</v-btn>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Error404Page'
};
</script>
