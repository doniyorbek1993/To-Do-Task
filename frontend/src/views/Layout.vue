<template>
  <v-main>
    <v-app-bar dense app>
      <v-btn to="/" text
        ><v-icon class="mr-1">mdi-home</v-icon> {{ "home" }}</v-btn
      >
      <v-spacer></v-spacer>

      <v-btn @click="logout" text outlined color="red">
        <v-icon>mdi-logout</v-icon>
        {{ user && user.name ? user.name : "" }}
      </v-btn>
    </v-app-bar>
    <v-container fluid>
      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>
</template>
<script>
// const axios = require("axios").default;
import Cookies from "js-cookie";
export default {
  data() {
    return {};
  },
  computed: {
    user() {
      return this.$store.state.user ? JSON.parse(this.$store.state.user) : {};
    },
  },
  methods: {
    logout() {
      Cookies.remove("access_token");
      Cookies.remove("user");
      this.$store.dispatch("setUser", null);
      this.$router.push("/login");
    },
  },
};
</script>
