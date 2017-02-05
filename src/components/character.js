'use strict'

import Vue from 'vue'
import { getIdByDisplayName, getSummary } from '../Bungie/api.js'
let co = require('co')


new Vue({

    el: '#character',

    data: {
        message: 'Waiting for your characters to enter an activity...',
        displayName: '',
        membershipType: '',
        membershipId: '',
        characterBase: [],
        activeCharacter: ''
    },

    methods: {
        assembleCharacters: co.wrap(function *() {
          
          let vm = this
          
          try {
          
          let response = yield getIdByDisplayName(vm.membershipType, vm.displayName)

          console.log('ID: ' + response.data.Response)

          vm.membershipId = response.data.Response;
          
          if (vm.membershipId === '') {

              vm.message = 'Failed to fetch your Bungie Membership ID'
            
              return;
          }
          
          response = yield getSummary(vm.membershipType, vm.membershipId)

          // Assign the character object of the response to a var
          vm.characterData = response.data.Response.data;

          let chars = vm.characterData.characters

          vm.characterBase = []; // reset the array - forces Vue to refresh

          for (let i = 0; i < chars.length; i++) {
            vm.characterBase.push(chars[i]);
            if (chars[i].characterBase.currentActivityHash > 0) {
              vm.activeCharacter = chars[i];
            };
          }

          // Just for displaying that we successfully grabed an active character
          if (vm.activeCharacter) {
            console.log('Active Character: ' + vm.activeCharacter)
          } else {
            console.log('It seems the player with the ID of ' + vm.membershipId + ' doesn\'t have any active characters.')
            vm.message = 'None of your characters seem to be in an activity'
          }   


        } catch (err) {
          console.error(err);
          vm.message = 'Failed to assemble characters: ' + err.statusText;
        }
          
      }),

      isActive: function(characters) {
        return characters.characterBase.currentActivityHash > 0;
      },

      checkActivity: function() {
        try {
          console.log('Reload Method Fired!')
          setTimeout(this.assembleCharacters, 5000)
        } catch (e) {
          console.log('Error from checkActivity' + e)
        }
      }
    },

    computed: {}

})
