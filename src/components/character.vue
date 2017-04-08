<template>
<section class="section" :thisAccount="getActivity(fetchGamer)">
  <div class="container" v-if="activeCharacter != ''">
    <span class="title">Active Character</span>
    <hr>
    <div class="columns">
      <div class="column emblem is-1" 
          :style="{ 'background': 'url(https://bungie.net' + activeCharacter.emblemPath + ') no-repeat' }">
      </div>
      <div class="column stats" 
          :style="{ 'background': 'url(https://bungie.net' + activeCharacter.backgroundPath + ') no-repeat' }">
        <div class="columns">
            <div class="column class">
                <p>{{ characterClass }}</p>
            </div>
            <div class="column blevel is-1">
                <p>{{ activeCharacter.characterLevel }}</p>
            </div>
        </div>
        <div class="columns">
          <div class="column race is-1">
              <p>{{characterRace}}</p>
          </div>
          <div class="column gender">
              <p>{{ characterGender}}</p>
          </div>
          <div class="column plevel is-1">
              <p>{{ activeCharacter.characterBase.powerLevel }}</p>
          </div>
        </div>
      </div>
      <div class="column">
        <section if="activeCharacter != ''" class="activity">
          <div class="activityImage">
            <figure class="activityBackground">
                <img :src="'https://www.bungie.net' + characterActivity.pgcrImage" alt="activityBackground">
            </figure>
            <figure class="activityIcon">
                <img :src="'https://www.bungie.net' + characterActivity.icon" alt="activityIcon">
            </figure>
          </div>
          <div class="column content">
            <h2>{{ characterActivity.activityName }}</h2>
            <h3>{{ characterActivity.activityDescription }}</h3>
          </div>
        </section>
      </div>
    </div>
  </div>
  <div class="container" v-else>
    <div class="notification is-primary" v-show="characterMessage">
      {{ characterMessage }}
    </div>
  </div>
</section>

</template>

<script>
const _ = require('underscore')
import Store from '../store'
import { searchDestinyPlayer, getSummary, getActivity, getClass, getGender, getRace } from '../Bungie/api.js'

export default {
  name: 'Character',
  Store,
  data () {
    return {
      gamer: '',
      characterMessage: '',
      activeCharacter: '',
      characterGender: '',
      characterRace: '',
      characterClass: '',
      characterActivity: ''
    }
  },
  computed: {
    fetchGamer: function() {
      return Store.getters.fetchGamer
    },
    fetchAccount: function() {
      return Store.getters.fetchAccount
    },
    fetchSummary: function() {
      return Store.getters.fetchSummary
    },
    fetchActiveCharacter: function() {
      return Store.getters.fetchActive
    }
  },
  methods: {
    getPlayer: async function(obj) {
      let res = await searchDestinyPlayer(obj)
      let account = res.data.Response
      if(account){
        if(account.length > 0){
          Store.commit('storeAccount', account)
        }else{
          // Display message that the account could not be found
          this.characterMessage = `No valid BNet account can be found with the name - `
          + obj + `. Make you are using a valid BNet account name and not a Twitch handle...`
        }
      }else{
        this.characterMessage = 'Seemed to have lost our network connection...'
      }
    },
    getAccountSummary: async function(obj) {
      if(this.fetchGamer){
        // Find the player on BNet and store their info
        await this.getPlayer(obj)
        // Fetch that info from the Store and put into a var 
        let account = await this.fetchAccount
        // Use map to extract the data we need for the next API call and 
        // place it in the Store for further use... later...
        account.map((x)=>{
          Store.commit('storeMembershipId', x.membershipId)
          Store.commit('storeMembershipType', x.membershipType)
        })
        let summary = await getSummary(Store.state.membershipType, Store.state.membershipId)
        if(summary.data.ErrorCode != 1){
          this.characterMessage = 'Error fetching Summary: ' + summary.data.ErrorStatus + ' :' + summary.data.Message
        }else{
          Store.commit('storeSummary', summary)
        }        
      }else{
        // Return message to display that no account was found
        this.characterMessage = 'No characters found using this account... ' + obj
      }
    },
    getActiveCharacter: async function(obj) {
      if(this.fetchGamer){
        await this.getAccountSummary(obj)
        let characters = await this.fetchSummary
        let chars = characters.data.Response.data.characters
        let active = []
        
        for (let i = 0; i < chars.length; i++) {
          if (chars[i].characterBase.currentActivityHash > 0) {
            active.push(chars[i])
          }
        }

        Store.commit('storeActiveCharacters', active[0])

        this.activeCharacter = await this.fetchActiveCharacter
        if(this.activeCharacter != ''){
          let characterRace = []
          characterRace.push(await getRace(this.activeCharacter.characterBase.raceHash))
          characterRace.map((x)=>{
            this.characterRace = x.data.Response.data.race.raceName
          })

          let characterClass = []
          characterClass.push(await getClass(this.activeCharacter.characterBase.classHash))
          characterClass.map((x)=>{
            this.characterClass = x.data.Response.data.classDefinition.className
          })

          let characterGender = []
          characterGender.push(await getGender(this.activeCharacter.characterBase.genderHash))
          characterGender.map((x)=>{
            this.characterGender = x.data.Response.data.gender.genderName
          })
        }else{
          this.characterMessage = 'There are no active characters on ' + this.fetchGamer + "'s account at the moment..."
        }
      }
    },
    getActivity: _.throttle(async function(obj) {
      let gamertag = this.fetchGamer
      if(gamertag.length > 0){
        await this.getActiveCharacter(obj)
        if(this.activeCharacter != ''){
          let activity = await getActivity(this.activeCharacter.characterBase.currentActivityHash)
          Store.commit('storeActivity', activity.data.Response.data.activity)
          this.characterActivity = Store.getters.fetchActivity
        }
      }else{
        this.characterMessage = 'Please enter a valid Bungie.net Username or gamertag to get started...'
      }      
    }, 7000, true)
  }
}
</script>
