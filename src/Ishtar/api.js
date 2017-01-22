"use strict"

const Axios = require("axios")

// Confire Axios
const axios = Axios.create({
    baseURL: "http://api.ishtar-collective.net/"
})

function getItem(item) {
    return axios("items/" + item)
}

function getCategory(string) {
    return axios("categories/" + string)
}

function getCard(string) {
    return axios("cards/" + string)
}

module.exports.getItem = getItem
module.exports.getCategory = getCategory
module.exports.getCard = getCard
