<template>
  <v-container class="page" fluid>
    <v-row dense>

      <v-col cols="12" md="3">
        <v-card>

          <div class="d-flex flex-row align-center pa-3">

            <v-avatar size="64" class="me-3">
              <v-img :src="$user.profile ? $user.profile.path : $userPlaceholder" />
            </v-avatar>

            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-bold">{{ $user.name }}</span>
              <span class="caption font-weight-light">{{ $formatTime($user.createdAt, 'jYYYY/jMM/jDD') }}</span>
            </div>

          </div>

          <v-list nav class="pt-0">
            <v-list-item-group color="primary">

              <v-list-item to="/profile">
                <v-list-item-icon>
                  <v-icon>mdi-account</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>اطلاعات اکانت</v-list-item-title>
                  <v-list-item-subtitle class="caption">
                    مشاهده و تغییر اطلاعات حساب کاربری
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

            </v-list-item-group>
          </v-list>

        </v-card>
      </v-col>

      <v-col cols="12" md="9">
        <router-view />
      </v-col>

    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'ProfileBase',
  data: () => ({
    loading: false
  })
};

</script>
