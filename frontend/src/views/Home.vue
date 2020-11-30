<template>
  <div>
    <v-card>
      <v-card-title primary-title>
        <span>{{ "To-do List" }}</span>
        <v-spacer></v-spacer>
        <v-btn
          @click="newTodo()"
          color="success"
          class="ml-8"
          dark
          outlined
          small
          icon
        >
          <v-icon text>mdi-plus-thick</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="items"
          :height="screenHeight"
          dense
          :server-items-length="server_items_length"
          :options.sync="dataTableOptions"
          :footer-props="{
            itemsPerPageOptions: [20, 50, 100, -1],
            itemsPerPageAllText: 'All',
            itemsPerPageText: 'per page',
            showFirstLastPage: true,
          }"
          @update:page="updatePage"
          @update:items-per-page="updatePerPage"
        >
          <template v-slot:[`item.id`]="{ item }">
            {{ items.indexOf(item) + 1 }}
          </template>
          <template v-slot:[`item.status`]="{ item }">
            {{ item.status == 0 ? "New" : "Finished" }}
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              v-if="item.status == 0"
              icon
              color="success"
              @click="finish(item)"
              ><v-icon>mdi-thumb-up</v-icon></v-btn
            >
            <v-btn icon color="orange" @click="update(item)"
              ><v-icon>mdi-pencil</v-icon></v-btn
            >
            <v-btn icon color="red" @click="remove(item.id)"
              ><v-icon>mdi-delete</v-icon></v-btn
            >
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-dialog v-model="editDialog" width="500">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          <span class="headline">{{ "Add new To-do" }}</span>
          <v-spacer></v-spacer>
          <v-btn
            color="red"
            outlined
            x-small
            fab
            class
            @click="editDialog = false"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form @keyup.native.enter="save" ref="dialogForm">
            <v-row>
              <v-col cols="12">
                <label for>{{ "name" }}</label>
                <v-text-field
                  v-model="form.name"
                  :rules="[(v) => !!v || 'input_required']"
                  hide-details="auto"
                  dense
                  outlined
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="save">{{ "save" }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="loading" width="300" hide-overlay>
      <v-card color="primary" dark>
        <v-card-text>
          {{ "loadingText" }}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
let axios = require("axios").default;
import Swal from "sweetalert2";

export default {
  data: () => ({
    editDialog: false,
    DialogHeaderText: "",
    items: [],
    loading: false,
    form: {
      id: Date.now(),
      name: "",
    },
    page: 1,
    from: 0,
    server_items_length: -1,
    dataTableOptions: { page: 1, itemsPerPage: 20 },
  }),
  computed: {
    screenHeight() {
      return window.innerHeight - 210;
    },
    headers() {
      return [
        { text: "#", value: "id", width: "100" },
        { text: "name", value: "name" },
        { text: "status", value: "status" },
        { text: "", value: "actions", width: "140" },
      ];
    },
  },

  methods: {
    updatePage() {
      this.getList();
    },
    updatePerPage() {
      this.getList();
    },
    getList() {
      this.loading = true;
      axios
        .post(this.$store.state.backend_url + "api/tasks", {
          pagination: this.dataTableOptions,
        })
        .then((res) => {
          this.items = res.data.data;
          this.server_items_length = res.data.total;
          this.from = res.data.from;
          this.loading = false;
        });
    },
    newTodo() {
      this.form = {
        id: Date.now(),
        name: "",
      };
      this.editDialog = true;
      this.DialogHeaderText = "Add new Task";
      if (this.$refs.dialogForm) this.$refs.dialogForm.reset();
    },
    update(item) {
      this.editDialog = true;
      this.DialogHeaderText = "Edit";
      this.form = JSON.parse(JSON.stringify(item));
    },
    finish(item) {
      this.loading = true;
      axios
        .get(this.$store.state.backend_url + "api/tasks/finish/" + item.id)
        .then(() => {
          this.loading = false;
          this.getList();
        })
        .catch(() => {
          this.loading = false;
          Swal.fire({
            position: "center",
            icon: "error",
            width: "250px",
            title: "Something is wrong",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        });
    },
    save() {
      if (this.$refs.dialogForm.validate()) this.loading = true;
      axios
        .post(this.$store.state.backend_url + "api/tasks/update", this.form)
        .then(() => {
          this.editDialog = false;
          this.getList();
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
          Toast.fire({
            icon: "success",
            title: "Successfully saved",
          });
          this.loading = false;
        })
        .catch(function (error) {
          console.log(error);
          this.loading = false;
        });
    },
    remove(id) {
      Swal.fire({
        title: "Delete",
        text: "Do you really want to delete this task?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
        cancelButtonText: "Close",
      }).then((result) => {
        if (result.value) {
          this.loading = true;
          axios
            .delete(this.$store.state.backend_url + "api/tasks/delete/" + id)
            .then(() => {
              this.items = this.items.filter((v) => v.id != id);
              Swal.fire({
                position: "top-end",
                toast: true,
                icon: "success",
                title: "deleted",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
              this.loading = false;
            })
            .catch((error) => {
              console.error(error);
              this.loading = false;
              Swal.fire({
                position: "center",
                icon: "error",
                width: "250px",
                title: "Something is wrong",
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
              });
            });
        }
      });
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
