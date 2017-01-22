"use strict"

const lore = require("./src/Ishtar/resource")
const Bungie = require("./src/Bungie/character")

// Proposed Ishtar Usage Examples
let weapon = lore.Ishtar.getItem("bad-juju")
let card = lore.Ishtar.getCard("bad-juju")
let category = lore.Ishtar.getCategory("toland-the-shattered")

// Proposed Bungie API Usage Examples
let gamertag = "unisys12" // fetched from webpage input
let platform = 1 // fetched from drop-down, xbox=1, psn=2

let id = Bungie.Character.getId(platform, gamertag)
let characters = Bungie.Character.getSummary(platform, id)

// Of course, if you try to console.log() any of these they return 'undefined'
// I guess I need to set callbacks or I am doing something wrong in the execution
// of the Promise's


// const mod = require("./src/Test/test")
//
// console.log(mod.TestModule.publicMethod("Saying A Thing!"))
