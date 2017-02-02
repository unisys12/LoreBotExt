'use strict'

import Vue from 'vue'
let VueResource = require('vue-resource')

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
        assembleCharacters: function() {
        console.log('Assembling Characters')
          let vm = this.$data;

          this.$http.get('http://www.bungie.net/Platform/Destiny/' + vm.membershipType + '/Stats/GetMembershipIdByDisplayName/' + vm.displayName + '/')
          .then(function (response) {

              vm.membershipId = response.body.Response;

          }, function (err) {
              vm.message = 'Failed to fetch your MembershipID: ' + err;
          })
          .then(function () {
            this.$http.get('http://www.bungie.net/Platform/Destiny/' + vm.membershipType + '/Account/' + vm.membershipId + '/Summary/')
            .then(function (response) {

              let vm = this.$data;
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
              for (let i = 0; i < chars.length; i++) {
                  vm.characterBase.push(chars[i]);
              }

            }, function (err) {
                vm.message = 'Failed fetch your account summary: ' + err
            })
            .then(function() {

              vm.activeCharacter = vm.characterBase.filter(this.isActive)

              // Just for displaying that we successfully grabed an active character
              if(vm.activeCharacter != '') {
                  console.log('Active Character: ' + vm.activeCharacter)
              } else {
                  console.log('It seems the player with the ID of ' + vm.membershipId + ' doesn\'t have any active characters.')
              }              

              if (vm.activeCharacter == 0) {
                vm.message = 'None of your characters seem to be in an activity'
              }

              try {
                this.checkActivity;
              } catch (e) {
                console.log('Error calling checkActivity' + e)
              } 

            }, function(err) {
              vm.message = 'Error building character activity with MemID of: '+ vm.membershipId + ' Error: ' + err
            })
          })
      },

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