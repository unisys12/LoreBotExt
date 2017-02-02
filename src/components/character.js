'use strict'

import Vue from 'vue'

let VueResource = require('vue-resource')
let co = require('co')

Vue.use(VueResource)

let character = new Vue({

    el: '#character',

    data: {
        message: 'Waiting for your characters to enter an activity...',
        displayName: '',
        membershipType: '',
        characterBase: [],
        activeCharacter: ''
    },

    // Configure Vue-Resource Options
    http: {
        headers: {
            'X-API-KEY': '7ced29b9f06844efb9102fbf73218362'
        }
    },

    methods: {
      assembleCharacters: assembleCharacters
    },

    computed: {}

})


function assembleCharacters() {

  console.log('Assembling Characters')
  let vm = this;

  co(function *() {

    try {
      let response = yield vm.$http.get('http://www.bungie.net/Platform/Destiny/' +
              vm.membershipType + '/Stats/GetMembershipIdByDisplayName/' +
              vm.displayName + '/')

      vm.membershipId = response.body.Response;
      if (vm.membershipId === "0") {
          vm.message = 'Failed to fetch your Bungie Membership ID'
          return;
      }
      response = yield vm.$http.get('http://www.bungie.net/Platform/Destiny/' + 
                    vm.membershipType + '/Account/' + 
                    vm.membershipId + '/Summary/')

      // Assign the character object of the response to a var
      //var characterData = response.body.Response.data.characters;
      vm.characterData = response.body.Response.data;

      let chars = vm.characterData.characters

      /**
       *  Iterate through that new object to obtain each characters base and store those seperately.
       *  If your not familiar with the character API, the assignment below can seem confusing. Let me
       *  explain -
       *  Take note of the character object above. Each API response is wrapped in a Response object.
       *  Inside that is a data object, followed by a characters array object, which stores all your
       *  characters within another object called a "character base". It would looke something like this:
       *  'Response.data.characters[0].characterBase' - Would be the first character you created.
       *  'Response.data.characters[1].characterBase' - Would be the second character you created.
       *  'Response.data.characters[2].characterBase' - Would be the third character you created.
       *  So... I am iterating over the characters objects and storing each one within a characterBase
       *  object in the data store.
       */

      vm.characterBase = []; // reset the array - forces Vue to refresh
      vm.activeCharacter = undefined;

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

  });
}