'use strict'

import Vue from 'vue'
import { searchDestinyPlayer, getIdByDisplayName, getSummary, getActivity, getClass, getGender, getRace } from '../Bungie/api.js'
import Ishtar from '../Ishtar/api'
import grimoireDefinitions from '../Bungie/grimoireDefs'
let co = require('co')


new Vue({

    el: '#character',

    data: {
        message: 'Waiting for your characters to enter an activity...',
        cardMessage: 'Sorry, there does not seem to be a Grimoire Card for this activity... BOO!',
        categoryMessage: '',
        displayName: '',
        membershipType: '',
        membershipId: '',
        characterBase: [],
        activeCharacter: '',
        characterGender: '',
        characterRace: '',
        characterClass: '',
        activity: '',
        grimoireCard: '',
        grimoireCategories: ''
    },

    methods: {
        assembleCharacters: co.wrap(function *() {
          
          let vm = this
          
          try {
          
            let res = yield searchDestinyPlayer(vm.displayName)          
            let player = res.data.Response
            
            if(player.length > 0){
              player.map((x)=>{
                vm.membershipId = x.membershipId
                vm.membershipType = x.membershipType
              })
            }else{
              vm.message = 'There does not seem to be a player in the world of Destiny with the name <i>' + vm.displayName + '</i>, on either console. Make sure you enter a vaild gamertag (xbl or psn) or Bungie username.'
              return
            } 
            
            let response = yield getSummary(vm.membershipType, vm.membershipId)

            if(response.data.ErrorCode != 1){
              vm.message = response.data.ErrorStatus + ': ' + response.data.Message
              return
            }

            vm.characterData = response.data.Response.data;

            let chars = vm.characterData.characters

            /**
             * TO-DO
             * Extract the code below, to line 90 at least,
             * to external file
             */
            let active = []

            // Find any active characters
            for (let i = 0; i < chars.length; i++) {
              if (chars[i].characterBase.currentActivityHash > 0) {
                active.push(chars[i])
              }
            }

            if(active.length > 0) {
              vm.activeCharacter = active[0]

              // Will extract the following three maps to a single method later
              let characterRace = []
              characterRace.push(yield getRace(vm.activeCharacter.characterBase.raceHash))
              characterRace.map((x)=>{
                vm.characterRace = x.data.Response.data.race.raceName
              })

              let characterClass = []
              characterClass.push(yield getClass(vm.activeCharacter.characterBase.classHash))
              characterClass.map((x)=>{
                vm.characterClass = x.data.Response.data.classDefinition.className
              })

              let characterGender = []
              characterGender.push(yield getGender(vm.activeCharacter.characterBase.genderHash))
              characterGender.map((x)=>{
                vm.characterGender = x.data.Response.data.gender.genderName
              })    

              //yield this.resolveActivity
              let activity = vm.activeCharacter.characterBase.currentActivityHash
              let act = yield getActivity(activity)

              vm.activity = act.data.Response.data.activity

              yield this.fetchActivityCards(vm.activity.activityName)
              
            } else {
              vm.message = 'None of your characters seem to be in an activity'
          }

        } catch (err) {
          console.error(err);
          vm.message = 'Failed to assemble characters: ' + err;
        }
          
      }),

      checkActivity: function() {
        try {
          console.log('Reload Method Fired!')
          setInterval(this.assembleCharacters, 10000)
        } catch (e) {
          console.log('Error from checkActivity' + e)
        }
      },

      resolveActivity: co.wrap(function *() {
        let vm = this
        let activity = vm.activeCharacter.characterBase.currentActivityHash
        let act = yield getActivity(activity)

        vm.activity = act.data.Response.data.activity
      }),

      /**
       * TO-DO 
       * =====
       * Need to better handle activities that do not have a Grimoire Card
       * so we don't spam ishtar api with bad requests. What is below does
       * properly display a message, but does not stop calling ishtar api.
       */
      fetchActivityCards: async function(string) {
        
        let vm = this
        //let cards = yield Ishtar.getCards(this.processSlug(string))
        if(vm.activity != '') {
          let cards = await grimoireDefinitions.fetchCards(string)
          
          // Store grimoire card data
          if(cards){
            vm.grimoireCard = cards
          } 
        }             
      
      }

    },

    computed: {

    }

})
