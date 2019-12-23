<template>
  <v-container fluid fill-height style="background-color: #EAEAEA">
    <v-row align-center class="ma-0">
      <v-col class="px-4 text-center">
        
        <h1 class="text-error">صفحه مورد نظر شما موجود نیست!</h1>

        <v-btn class="mt-6" large color="error" to="/">بریم به صفحه اصلی!</v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Error404Page'
};
</script>
