<template>
  <v-card :loading="loading">

    <v-card-title>
      <v-icon v-if="icon" class="me-3">
        {{ icon }}
      </v-icon>
      {{ title }}
    </v-card-title>

    <v-card-text>
      <v-treeview
        item-key="_id"
        item-text="__title"
        item-children="__children"
        hoverable rounded
        open-on-click
        :items="items"
        :load-children="loadItemChildren">

        <template v-if="avatarKey" #prepend="{ item }">
          <v-avatar v-if="item[avatarKey]" size="32" class="ms-1 me-3">
            <v-img :src="item[avatarKey].path" />
          </v-avatar>
        </template>

      </v-treeview>
    </v-card-text>

  </v-card>
</template>

<script>
import { YNetwork } from 'ynetwork';

import { loadAllResource, pluralizeModelName, transformResourceToTitle } from './y-resource-util';

export default {
  name: 'YResourceTreeViewer',
  props: {
    icon: String,
    title: String,
    model: String,
    avatarKey: String,
    parentalKey: String
  },
  data: () => ({
    loading: false,
    items: []
  }),
  created() {
    this.loadInitial();
  },
  methods: {
    async loadInitial() {

      this.loading = true;
      const data = await loadAllResource(
        `${this.$apiBase}/${pluralizeModelName(this.model)}/`,
        `filters=${this.parentalKey}:=:Xnull${this.avatarKey ? `&populates=${this.avatarKey}:path` : ''}`,
        this.$generalHandle
      );
      this.loading = false;


      this.loading = true;
      await Promise.all(
        data.map(async it => {
          it.__title = await transformResourceToTitle(this.$apiBase, this.model, it._id);
        })
      );
      this.loading = false;


      this.loading = true;
      await Promise.all(
        data.map(it =>
          this.checkItemHasChildren(it)
        )
      );
      this.loading = false;


      this.items = data;

    },
    async checkItemHasChildren(item) {

      const { status, data } = await YNetwork.get(`${this.$apiBase}/${pluralizeModelName(this.model)}/count?filters=${this.parentalKey}:=:${item._id}`);
      if (this.$generalHandle(status, data)) return;

      item.__children = data > 0 ? [] : undefined;

    },
    async loadItemChildren(item) {

      this.loading = true;
      const data = await loadAllResource(
        `${this.$apiBase}/${pluralizeModelName(this.model)}`,
        `filters=${this.parentalKey}:=:${item._id}${this.avatarKey ? `&populates=${this.avatarKey}:path` : ''}`,
        this.$generalHandle
      );
      this.loading = false;


      this.loading = true;
      await Promise.all(
        data.map(async it => {
          it.__title = await transformResourceToTitle(this.$apiBase, this.model, it._id);
        })
      );
      this.loading = false;


      this.loading = true;
      await Promise.all(
        data.map(it =>
          this.checkItemHasChildren(it)
        )
      );
      this.loading = false;

      item.__children = data.length > 0 ? data : undefined;

    }
  }
};

</script>