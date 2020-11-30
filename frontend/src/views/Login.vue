<template>
  <div>
    <h2 style="text-align: center; margin-top: 30px">TO-DO Task</h2>
    <v-card width="400" class="mx-auto mt-12">
      <v-card-title primary-title class="justify-center"> Login </v-card-title>
      <v-card-text>
        <v-form @keyup.native.enter="login" name="testform">
          <v-row>
            <v-col cols="12">
              <label for>{{ "Email" }}</label>
              <v-text-field
                v-model="email"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <label for>{{ "Password" }}</label>
              <v-text-field
                v-model="password"
                type="password"
                outlined
                dense
                hide-details="auto"
              ></v-text-field>
              <v-alert
                v-if="errorAlert && this.email != '' && this.password != ''"
                dense
                text
                outlined
                type="error"
                icon="mdi-alert-outline"
                class="caption py-1"
                >{{ "Incorrect login credentials" }}</v-alert
              >
            </v-col>
            <v-col cols="12">
              <v-btn
                outlined
                class="float-right"
                color="indigo"
                @keyup.native.enter="login"
                @click="login"
                >Ok</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
    <v-dialog v-model="loading" width="300" hide-overlay>
      <v-card color="primary" dark>
        <v-card-text>
          {{ "loading" }}
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
const axios = require("axios").default;
import Cookie from "js-cookie";
export default {
  data() {
    return {
      email: "",
      password: "",
      errorAlert: false,
      loading: false,
    };
  },
  methods: {
    login() {
      this.loading = true;
      axios
        .post(this.$store.state.backend_url + "oauth/token", {
          grant_type: "password",
          client_id: "2",
          client_secret: "mKJYNTtAc6Bmlf9fq0wsDI2NmJQsDppz4ERZPV45",
          username: this.email,
          password: this.password,
        })
        .then((res) => {
          Cookie.set(
            "access_token",
            res.data.token_type + " " + res.data.access_token
          );
          axios.defaults.headers.common = {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: Cookie.get("access_token"),
          };
          axios
            .get(this.$store.state.backend_url + "api/users/show")
            .then((res) => {
              Cookie.set("user", res.data);
              this.$store.dispatch("setUser", JSON.stringify(res.data));
              this.$router.push(this.$store.state.redirect_url || "/");
              this.$store.dispatch("setRedirectUrl", null);
            });
          this.loading = false;
        })
        .catch((error) => {
          this.errorAlert = true;
          console.log(error);
          this.loading = false;
        });
    },
  },
  mounted() {
    Cookie.remove("access_token");
  },
};
</script>
