"use quotes"

const Bungie = require("./api")

let Character = (function() {

    return {

        getCharacterId: (membershipType, displayName) => {

            new Promise((resolve, reject) => {

                Bungie.getIdByDisplayName(membershipType, displayName)

                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

            })

        },

        getCharacterSummary: (membershipType, membershipId) => {

            new Promise((resolve, reject) => {

                Bungie.getSummary(membershipType, membershipId)

                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

            })

        }

    }

})()

module.exports.Character = Character
