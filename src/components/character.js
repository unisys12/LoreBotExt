'use strict'

import Vue from 'vue'
import { getIdByDisplayName, getSummary, getActivity, getClass, getGender, getRace } from '../Bungie/api.js'
let co = require('co')


new Vue({

    el: '#character',

    data: {
        message: 'Waiting for your characters to enter an activity...',
        displayName: '',
        membershipType: '',
        membershipId: '',
        characterBase: [],
        activeCharacter: '',
        characterGender: '',
        characterRace: '',
        characterClass: '',
        activity: ''
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
            vm.characterRace = yield getRace(vm.activeCharacter.characterBase.raceHash)
            vm.characterClass = yield getClass(vm.activeCharacter.characterBase.classHash)
            vm.characterGender = yield getGender(vm.activeCharacter.characterBase.genderHash)
            yield this.resolveActivity
          } else {
            vm.message = 'None of your characters seem to be in an activity'
          }

        } catch (err) {
          console.error(err);
          vm.message = 'Failed to assemble characters: ' + err.statusText;
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
      })
    },

    computed: { }

})
