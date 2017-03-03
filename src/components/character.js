'use strict'

import Vue from 'vue'
import { getIdByDisplayName, getSummary, getActivity, getClass, getGender, getRace } from '../Bungie/api.js'
import Ishtar from '../Ishtar/api'
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
          
          let response = yield getIdByDisplayName(vm.membershipType, vm.displayName)

          vm.membershipId = response.data.Response;
          
          if (vm.membershipId === '') {

              vm.message = 'Failed to fetch your Bungie Membership ID'
            
              return;
          }
          
          response = yield getSummary(vm.membershipType, vm.membershipId)

          vm.characterData = response.data.Response.data;

          let chars = vm.characterData.characters

          vm.characterBase = [];

          // Find any active characters
          for (let i = 0; i < chars.length; i++) {
            vm.characterBase.push(chars[i]);
            if (chars[i].characterBase.currentActivityHash > 0) {
              vm.activeCharacter = chars[i];
            };
          }

          if (vm.activeCharacter != '') {
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
      fetchActivityCards: co.wrap(function *(string) {
        
        let vm = this
        let cards = yield Ishtar.getCards(this.processSlug(string))
        
        // Store grimoire card data
        if(cards.request.status === 200){
          vm.grimoireCard = cards.data.grimoire_card
        }

        // While we're at it, store any category data as well
        if(cards.data.grimoire_card.categories) {
          vm.grimoireCategories = cards.data.grimoire_card.categories
        }      
      
    }),

    // fetchCategories: co.wrap(function *(url) {

    //   let vm = this
    //   let category = yield Ishtar.getCategories(url)

    //   category.map( (x)=>{
    //     let vm.
    //   })

    // }),

      processSlug: function(string) {        
        let input = string
        .toLowerCase()
        .replace(/[.*+?^${}()':|[\]\\]/g, "")
        .replace(/\s+/g, "-")
        
        return input
      }
    },

    computed: {

    }

})
