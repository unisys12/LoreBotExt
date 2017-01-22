"use quotes"

const Bungie = require("./api")

let Character = (function() {

    let getCharacterId = (membershipType, displayName) => {

        return new Promise((resolve, reject) => {

            Bungie.getIdByDisplayName(membershipType, displayName)

                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

        })

    }

    let getCharacterSummary = (membershipType, membershipId) => {

        return new Promise((resolve, reject) => {

            Bungie.getSummary(membershipType, membershipId)

                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

        })

    }

    let getSummary = (membershipType, membershipId) => {

        getCharacterSummary(membershipType, membershipId)
        .then((response) => {
            return response
        }, (err) => {
            return err
        })

    }

    let getId = (membershipType, displayName) => {

        getCharacterId(membershipType, displayName)
        .then((response) => {
            return response
        }, (err) => {
            return err
        })

    }

    return {
        getSummary: getSummary,
        getId: getId
    }

})()

module.exports.Character = Character
