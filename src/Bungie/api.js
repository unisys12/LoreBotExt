"use strict"

const Axios = require("axios")

// Confire Axios
const axios = Axios.create({
    headers: {
        "X-API-KEY": "7ced29b9f06844efb9102fbf73218362"
    }
})

function getIdByDisplayName(membershipType, displayName) {
    return axios(membershipType + "/Stats/GetMembershipIdByDisplayName/" + displayName)
}

function getSummary(membershipType, membershipId) {
    return axios("http://www.bungie.net/Platform/Destiny/" + membershipType + "/Account/" + membershipId + "/Summary/")
}

module.exports.getIdByDisplayName = getIdByDisplayName
module.exports.getSummary = getSummary
