import Vue from 'vue'
import Vuex from 'vuex'
import Cookies from 'js-cookie'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    backend_url: 'http://task.uz/',
    user: Cookies.get('user'),
  },
  mutations: {
    setUser: (state, arg) => {
      state.user = arg;
    },
    setAccessToken: (state, arg) => {
      Cookies.set('access_token', JSON.stringify(arg), 1)
      state.access_token = JSON.stringify(arg)
    },
    setRedirectUrl(state, arg) {
      state.redirect_url = arg
    },
  },
  actions: {
    setUser: (context, arg) => {
      context.commit('setUser', arg)
    },
    setAccessToken: (context, arg) => {
      context.commit('setAccessToken', arg)
    },
    setRedirectUrl: (context, arg) => {
      context.commit('setRedirectUrl', arg)
    },
  },
  modules: {}
})