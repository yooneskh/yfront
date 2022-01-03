<template>
  <v-card :loading="loading">

    <v-card-title>

      <v-icon v-if="icon" class="me-3">
        {{ icon }}
      </v-icon>
      {{ title }}

      <v-spacer />

      <v-btn text color="primary" @click="addWithParent()">
        <v-icon left>
          mdi-plus
        </v-icon>
        افزودن مورد جدید
      </v-btn>

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

        <template #append="{ item }">
          <div class="d-flex flex-row" style="gap: 8px;">

            <v-tooltip fixed top>
              <template #activator="{ on }">
                <v-btn small icon color="primary" v-on="on" @click.stop="addWithParent(item)">
                  <v-icon small>
                    mdi-plus
                  </v-icon>
                </v-btn>
              </template>
              <span>
                افزودن به این والد
              </span>
            </v-tooltip>

            <v-tooltip fixed top>
              <template #activator="{ on }">
                <v-btn small icon color="warning" v-on="on" @click.stop="editItem(item)">
                  <v-icon small>
                    mdi-pen
                  </v-icon>
                </v-btn>
              </template>
              <span>
                ویرایش
              </span>
            </v-tooltip>

            <v-tooltip fixed top>
              <template #activator="{ on }">
                <v-btn small icon color="error" v-on="on" @click.stop="deleteItem(item)">
                  <v-icon small>
                    mdi-delete
                  </v-icon>
                </v-btn>
              </template>
              <span>
                حذف
              </span>
            </v-tooltip>

          </div>
        </template>

      </v-treeview>
    </v-card-text>

  </v-card>
</template>

<script>

import { YNetwork } from 'ynetwork';
import { loadAllResource, pluralizeModelName, transformResourceToTitle } from './y-resource-util';

import YResourceDialog from './y-resource-dialog.vue';


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

    },
    async addWithParent(item) {

      const result = await this.$dialog(YResourceDialog, {
        modelName: this.model,
        baseResource: { [this.parentalKey]: item?._id }
      });
      if (!result) return;

      if (!item) {
        this.loadInitial();
      }
      else {
        this.loadItemChildren(item);
      }

    },
    async editItem(item) {

      const editItem = { ...item };

      if (this.avatarKey) {
        editItem[this.avatarKey] = editItem[this.avatarKey]._id;
      }

      const result = await this.$dialog(YResourceDialog, {
        modelName: this.model,
        baseResource: editItem
      });
      if (!result) return;

      this.loadItemChildren(item);

    },
    async deleteItem(item) {
      if (!await this.$dialogConfirmDelete({ title: item.__title })) return;

      this.loading = true;
      const { status, data } = await YNetwork.delete(`${this.$apiBase}/${pluralizeModelName(this.model)}/${item._id}`);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('حذف با موفقیت انجام شد.');

      if (this.items.some(it => it._id === item._id)) {
        this.loadInitial();
      }
      else {
        this.reloadParentOfItem(this.items, item);
      }

    },
    reloadParentOfItem(items, item) {

      for (const target of items) {
        if (!target.__children || target.__children.length === 0) continue;

        for (const child of target.__children) {
          if (child._id === item._id) {
            this.loadItemChildren(target);
            return;
          }
        }

        this.reloadParentOfItem(target.__children, item);

      }
    }
  }
};

</script>