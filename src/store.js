import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    displayName: ''
  },
  mutations: {
    storeDisplayName: function(state, string) {
      state.displayName = string
    }
  },
  getters: {
    fetchGamer: function(state) {
      return state.displayName
    }
  }
})