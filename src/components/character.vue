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
        <div class="columns" >
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
          console.log('Error fetching Summary: ', summary)
          this.characterMessage = summary.data.ErrorStatus + ' :' + summary.data.Message
        }else{
          Store.commit('storeSummary', summary)
        }        
      }else{
        // Return message to display that no account was found
        this.characterMessage = 'No characters found this account... ' + obj
        return
      }
    },
    getActiveCharacter: _.debounce(async function(obj) {
      if(this.fetchGamer){
        await this.getAccountSummary(obj)
        let characters = await this.fetchSummary
        let chars = characters.data.Response.data.characters
        // Not sure how well this will handle multiple active characters
        chars.map((x)=>{
          if(x.characterBase.currentActivityHash > 0) {
            Store.commit('storeActiveCharacters', x)
          }
        })
        this.activeCharacter = this.fetchActiveCharacter
        if(this.activeCharacter.length > 0){
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
    }, 1000, true),
    getActivity: async function(obj) {
      let gamertag = this.fetchGamer
      if(gamertag.length > 0){
        await this.getActiveCharacter(obj)
        if(this.activeCharacter != ''){
          let activity = await getActivity(this.activeCharacter.characterBase.currentActivityHash)
          Store.commit('storeActivity', activity.data.Response.data.activity)
          console.log('Currect Activity: ', Store.getters.fetchActivity)
        }
      }else{
        this.characterMessage = 'Please enter a valid Bungie.net Username or gamertag to get started...'
      }      
    },
  }
}
</script>

<style></style>

// 'use strict'

// import Vue from 'vue'
// import { searchDestinyPlayer, getIdByDisplayName, getSummary, getActivity, getClass, getGender, getRace } from '../Bungie/api.js'
// import Ishtar from '../Ishtar/api'
// import grimoireDefinitions from '../Bungie/grimoireDefs'
// let co = require('co')


// new Vue({

//     el: '#character',

//     data: {
//         message: 'Waiting for your characters to enter an activity...',
//         cardMessage: 'Sorry, there does not seem to be a Grimoire Card for this activity... BOO!',
//         categoryMessage: '',
//         displayName: '',
//         membershipType: '',
//         membershipId: '',
//         characterBase: [],
//         activeCharacter: '',
//         characterGender: '',
//         characterRace: '',
//         characterClass: '',
//         activity: '',
//         grimoireCard: '',
//         grimoireCategories: ''
//     },

//     methods: {
//         assembleCharacters: co.wrap(function *() {
          
//           let vm = this
          
//           try {
          
//             let res = yield searchDestinyPlayer(vm.displayName)          
//             let player = res.data.Response
            
//             if(player.length > 0){
//               player.map((x)=>{
//                 vm.membershipId = x.membershipId
//                 vm.membershipType = x.membershipType
//               })
//             }else{
//               vm.message = 'There does not seem to be a player in the world of Destiny with the name <i>' + vm.displayName + '</i>, on either console. Make sure you enter a vaild gamertag (xbl or psn) or Bungie username.'
//               return
//             } 
            
//             let response = yield getSummary(vm.membershipType, vm.membershipId)

//             if(response.data.ErrorCode != 1){
//               vm.message = response.data.ErrorStatus + ': ' + response.data.Message
//               return
//             }

//             vm.characterData = response.data.Response.data;

//             let chars = vm.characterData.characters

//             /**
//              * TO-DO
//              * Extract the code below, to line 90 at least,
//              * to external file
//              */
//             let active = []

//             // Find any active characters
//             for (let i = 0; i < chars.length; i++) {
//               if (chars[i].characterBase.currentActivityHash > 0) {
//                 active.push(chars[i])
//               }
//             }

//             if(active.length > 0) {
//               vm.activeCharacter = active[0]

//               // Will extract the following three maps to a single method later
//               let characterRace = []
//               characterRace.push(yield getRace(vm.activeCharacter.characterBase.raceHash))
//               characterRace.map((x)=>{
//                 vm.characterRace = x.data.Response.data.race.raceName
//               })

//               let characterClass = []
//               characterClass.push(yield getClass(vm.activeCharacter.characterBase.classHash))
//               characterClass.map((x)=>{
//                 vm.characterClass = x.data.Response.data.classDefinition.className
//               })

//               let characterGender = []
//               characterGender.push(yield getGender(vm.activeCharacter.characterBase.genderHash))
//               characterGender.map((x)=>{
//                 vm.characterGender = x.data.Response.data.gender.genderName
//               })    

//               //yield this.resolveActivity
//               let activity = vm.activeCharacter.characterBase.currentActivityHash
//               let act = yield getActivity(activity)

//               vm.activity = act.data.Response.data.activity

//               yield this.fetchActivityCards(vm.activity.activityName)
              
//             } else {
//               vm.message = 'None of your characters seem to be in an activity'
//           }

//         } catch (err) {
//           console.error(err);
//           vm.message = 'Failed to assemble characters: ' + err;
//         }
          
//       }),

//       checkActivity: function() {
//         try {
//           console.log('Reload Method Fired!')
//           setInterval(this.assembleCharacters, 10000)
//         } catch (e) {
//           console.log('Error from checkActivity' + e)
//         }
//       },

//       resolveActivity: co.wrap(function *() {
//         let vm = this
//         let activity = vm.activeCharacter.characterBase.currentActivityHash
//         let act = yield getActivity(activity)

//         vm.activity = act.data.Response.data.activity
//       }),

//       /**
//        * TO-DO 
//        * =====
//        * Need to better handle activities that do not have a Grimoire Card
//        * so we don't spam ishtar api with bad requests. What is below does
//        * properly display a message, but does not stop calling ishtar api.
//        */
//       fetchActivityCards: async function(string) {
        
//         let vm = this
//         //let cards = yield Ishtar.getCards(this.processSlug(string))
//         if(vm.activity != '') {
//           let cards = await grimoireDefinitions.fetchCards(string)
          
//           // Store grimoire card data
//           if(cards){
//             vm.grimoireCard = cards
//           } 
//         }             
      
//       }

//     },

//     computed: {

//     }

// })
