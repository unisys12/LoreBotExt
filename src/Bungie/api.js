'use strict'

const Axios = require('axios')

// Confire Axios
const axios = Axios.create({
    headers: {
        'X-API-KEY': '7ced29b9f06844efb9102fbf73218362'
    }
})

// Hard coding `-1` for membershipType to search both PSN and XBL accounts for displayName
function searchDestinyPlayer(displayName){
    return axios('http://www.bungie.net/Platform/Destiny/SearchDestinyPlayer/-1/' + displayName + '/')
}

function getIdByDisplayName(membershipType, displayName) {
    return axios('http://www.bungie.net/Platform/Destiny/' + membershipType + '/Stats/GetMembershipIdByDisplayName/' + displayName)
}

function getSummary(membershipType, membershipId) {
    return axios('http://www.bungie.net/Platform/Destiny/' + membershipType + '/Account/' + membershipId + '/Summary/')
}

function getRace(raceHash) {
    return axios('http://www.bungie.net/Platform/Destiny/' + 
    '/Manifest/8/' + raceHash)
}

function getGender(genderHash) {
    return axios('http://www.bungie.net/Platform/Destiny/' + 
    '/Manifest/4/' + genderHash)
}

function getClass(classHash) {
    return axios('http://www.bungie.net/Platform/Destiny/' + 
    '/Manifest/3/' + classHash)
}

function getActivity(definitionId) {
    return axios('http://www.bungie.net/Platform/Destiny/' + 
    '/Manifest/1/' + 
    definitionId + '/')
}

module.exports.searchDestinyPlayer = searchDestinyPlayer
module.exports.getIdByDisplayName = getIdByDisplayName
module.exports.getSummary = getSummary
module.exports.getRace = getRace
module.exports.getGender = getGender
module.exports.getClass = getClass
module.exports.getActivity = getActivity