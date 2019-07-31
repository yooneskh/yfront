<template>
  <v-container bg fill-height>
    <v-layout row wrap align-center>
      <v-flex class="px-4">
        
        <v-card max-width="385" class="mx-auto" outlined>
          <v-card-title class="text-center">Login</v-card-title>
          <v-card-text class="pt-1 pb-0">

            <v-form>
              <v-text-field label="Phone Number" />
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-btn block large color="primary" @click="mode = 'register'">{{mode}}</v-btn>
          </v-card-actions>
        </v-card>

      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'AuthPage',
  data: () => ({
    mode: 'login'
  })
};
</script>

<style lang="scss" scoped>

</style>