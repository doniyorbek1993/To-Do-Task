import Vue from 'vue'
import VueRouter from 'vue-router'
import Cookies from "js-cookie";
import store from "../store";
import Layout from "../views/Layout.vue";

Vue.use(VueRouter)

const routes = [{

    path: "",
    component: Layout,
    children: [{
        path: "",
        component: function () {
          return import("../views/Home.vue");
        },
      },
      {
        path: "/about",
        component: function () {
          return import("../views/About.vue");
        },
      },
      {
        path: "/layout",
        component: function () {
          return import("../views/Layout.vue");
        },
      },
    ],

  },
  {
    path: "/login",
    component: function () {
      return import("../views/Login.vue");
    },
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let access_token = Cookies.get("access_token");
  if (!access_token) {
    setTimeout(() => {
      access_token = Cookies.get("access_token");
    }, 100);
  }
  if (!access_token && to.fullPath != "/login") {
    store.dispatch("setRedirectUrl", to.fullPath);
    next({
      path: "/login",
    });
  } else next();
});

export default router;