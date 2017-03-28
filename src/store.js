import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    displayName: '',
    account: '',
    summary: '',
    membershipId: '',
    membershipType: '',
    activeCharacters: [],
    activity: '',
    grimoire: ''
  },
  mutations: {
    storeDisplayName: function(state, string) {
      state.displayName = string
    },
    storeAccount: function(state, account) {
      state.account = account
    },
    storeSummary: function(state, summary) {
      state.summary = summary
    },
    storeMembershipId: function(state, membershipId) {
      state.membershipId = membershipId
    },
    storeMembershipType: function(state, membershipType) {
      state.membershipType = membershipType
    },
    storeActiveCharacters: function(state, character) {
      state.activeCharacters = character
    },
    storeActivity: function(state, activity) {
      state.activity = activity
    },
    storeGrimoire: function(state, cards) {
      state.grimoire = cards
    }
  },
  getters: {
    fetchGamer: function(state) {
      return state.displayName
    },
    fetchAccount: function(state) {
      return state.account
    },
    fetchSummary: function(state) {
      return state.summary
    },
    fetchMembershipId: function(state) {
      return state.membershipId
    },
    fetchMembershipType: function(state) {
      return state.membershipType
    },
    fetchActive: function(state) {
      return state.activeCharacters
    }, 
    fetchActivity: function(state) {
      return state.activity
    },
    fetchCards: function(state) {
      return state.grimoire
    }
  }
})