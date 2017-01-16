### Project Goals
Create a browser extension that, once enabled, will allow the user to play Destiny and get Grimoire as well as other game related lore delivered to their browser in real time. In short, try to get as close to giving the player "in-game lore" without our code actually being in the game.

### Proposed Project Means
I propose to accomplish this, hopefully with some help from the community _(web dev and game alike)_ using a fairly modern web development structure and deliver it through as a Chrome Extension. This means, delivering all the content by way of not using a server to deliver pages or to generate dynamic content. To do this, the project will have to be built using one of the many Javascript frameworks on the market today. I have yet to decide on one at this time. Later, I would like to make this available to Firefox users as well, but need to get this running on Chrome first I think.

I will be utilizing most generally excepted methods of code construction (ES6) leveraging Babel here. Testing will be done using Mocha, Chai and Sinon unless a framework is chosen that requires me use something different.

I will be leveraging Bungies Open API for anything related to character summaries and the monitoring of activities. But most, if not all lore based information will be obtained using the Open API provided by ishtar-collective.net, with the approval of Baxter... owner of the later API.  

### Code Workflow:
1) Gather Base User Data
- When extension is loaded, user is greeted with a page that allows them to choose their console and enter their gamertag. These two items will be used throughout the rest of the codebase with Bungie API Endpoints.
-- `membershipType => console (xbox=1 or playstation=2)`
-- `displayName => gamertag`
- Since the Bungie API requires us to use the gamers “membershipID” and not their display name, the displayName will be used to get the membershipID, by using the endpoint:
-- `'http://www.bungie.net/Platform/Destiny/' + platform + '/Stats/GetMembershipIdByDisplayName/' +gamertag`
This returns a JSON Response that looks like:
```json
{
  "Response": "4611686018438360560",
  "ErrorCode": 1,
  "ThrottleSeconds": 0,
  "ErrorStatus": "Success",
  "Message": "Ok",
  "MessageData": {}
}
```
2) Fetch Character Summary
- Once we have captured the user's proper membershipID, we can call:
`'http://www.bungie.net/Platform/Destiny/' + platform + '/Account/' + membershipId + '/Summary/'`
This returns a JSON Response that looks like the following:
```json
{
  "Response": {
    "data": {
      "membershipId": "4611686018438360560",
      "membershipType": 1,
      "characters": [
        {
          "characterBase": {
            "membershipId": "4611686018438360560",
            "membershipType": 1,
            "characterId": "2305843009233578340",
            "dateLastPlayed": "2017-01-08T22:54:12Z",
            "minutesPlayedThisSession": "144",
            "minutesPlayedTotal": "62302",
            "powerLevel": 390,
            "raceHash": 3887404748,
            "genderHash": 3111576190,
            "classHash": 3655393761,
            "currentActivityHash": 0,
            "lastCompletedStoryHash": 0,
            "stats": {
              "STAT_DEFENSE": {
               "..."
              },
              "STAT_INTELLECT": {
                "..."
              },
              "STAT_DISCIPLINE": {
                "..."
              },
              "STAT_STRENGTH": {
                "..."
              },
              "STAT_LIGHT": {
                "..."
              },
              "STAT_ARMOR": {
                "..."
              },
              "STAT_AGILITY": {
                "..."
              },
              "STAT_RECOVERY": {
                "..."
              },
              "STAT_OPTICS": {

              }
            },
            "customization": {
              "..."
            },
            "grimoireScore": 4930,
            "peerView": {
              "equipment": [
                // List of Equipment and Items
              ]
            },
            "genderType": 0,
            "classType": 0,
            "buildStatGroupHash": 1514588224
          },
          "levelProgression": {
            // Progress Stats
          },
          "emblemPath": "/common/destiny_content/icons/2847680c4b152c9f088211f3b09047e6.jpg",
          "backgroundPath": "/common/destiny_content/icons/43fd049b9af53b06b16e521572c14109.jpg",
          "emblemHash": 1581640797,
          "characterLevel": 40,
          "baseCharacterLevel": 40,
          "isPrestigeLevel": false,
          "percentToNextLevel": 0
        },
        {
          "characterBase": {
            // 2nd Character Created
        },
        {
          "characterBase": {
            // 3rd Character Created
        ]
      },
      "grimoireScore": 4930,
      "versions": 15
    }
  },
  "ErrorCode": 1,
  "ThrottleSeconds": 0,
  "ErrorStatus": "Success",
  "Message": "Ok",
  "MessageData": {}
}
```
This is way too much information to cache, so... we should look for any character that might have recent activity. We can do this by inspecting `Response.data.characters.characterBase.currentActivityHash`. If this is 0, that means that this active is not active. If it contains a hash, it means that this character either currently in an active or just left an activity. When we find this, we can isolate that character from there.

This can be stored in a global object literal. From this, as changes take place, we can update the web page with the characters emblem, light level, grimoire score, as well as the players current activity.

3) Resovle the players CurrentActivityHash.
When we obtain and activity hash from the above reponse, we really have to resolve this hash to see what activity this really is. To do this, we can use the MongoDB I have setup on through Heroku.
- Collection to Query: 'destiny.manifest.en.DestinyActivityDefinition'
- Ex: Let's say the currentActivityHash return for our character is '2176272408'
-- db.getCollection('destiny.manifest.en.DestinyActivityDefinition').find({'_id': 2176272408})

_This returns an object such as the following:_
```json
{
    "_id" : 2176272408.0,
    "activityHash" : 2176272408.0,
    "activityName" : "The Shadow Thief",
    "activityDescription" : "A ruthless Fallen mercenary commanding the Wolfship Kaliks-Syn has been spotted near the Moon. Board the Ketch and end the reign of Taniks, the Scarred.",
    "icon" : "/img/theme/destiny/icons/node_strike_nightfall.png",
    "releaseIcon" : "/common/destiny_content/icons/56907cf7e1711bcee432570248f59751.png",
    "releaseTime" : 0,
    "activityLevel" : 42,
    "completionFlagHash" : 1665214730,
    "activityPower" : 0,
    "minParty" : 1,
    "maxParty" : 3,
    "maxPlayers" : 3,
    "destinationHash" : 4233735899.0,
    "placeHash" : 3128647858.0,
    "activityTypeHash" : 575572995,
    "tier" : 1,
    "pgcrImage" : "/img/theme/destiny/bgs/pgcrs/the_shadow_thief.jpg",
    "rewards" : [],
    "skulls" : [],
    "isPlaylist" : false,
    "isMatchmade" : true,
    "hash" : 2176272408.0,
    "index" : 0,
    "redacted" : false
}
```

From this, we can display a decent amount of info and the current activity, but more importantly, we can leverage the API of Ishtar-Collective and perform a search within Ishtar's Catagories, like so:

- `http://api.ishtar-collective.net/cards/the-shadow-thief`

_This will return a response like so, of the Grimoire Card:_
```json
{"grimoire_card":{"ishtar_ref":"the-shadow-thief","name":"The Shadow Thief","ishtar_url":"http://www.ishtar-collective.net/cards/the-shadow-thief","api_url":"http://api.ishtar-collective.net/cards/the-shadow-thief","bungie_ref":"601160","image_url":"/common/destiny_content/grimoire/hr_images/601160_f2b2609901154773ff742ae15eb0e3e4.jpg","intro":null,"intro_attribution":null,"description":"\u0026quot;The Wolves have sent a mercenary to Luna. Taniks, the Scarred. He would steal from the Hive all they know. Would align the Fallen with the shadows. You will stop him... but he will rejoice in your interference. Embraces conflict does Taniks. Revels in the trophies he collects from all he defeats. End his games.\u0026quot; - Variks, the Loyal","bungie_deleted":false,"categories":[{"ishtar_ref":"variks","name":"Variks","ishtar_url":"http://www.ishtar-collective.net/categories/variks","api_url":"http://api.ishtar-collective.net/categories/variks"}]}}
```

_We can then take this as far as we want really._

## Stage 1
Decide on the most basic of dependences to use within the project.
### Core Dependencies
- At this early stage, I know for sure I want to use the ODM Mongoose when connecting
to the MongoDB that contains the latest Destiny Manifest data.

### Development Dependencies
This project should be tested to the best of my ability _(which is not alot by the way)_ .
This project will require extensive testing, which at present, is a weakness of mine. I plan
to resolve that during this time.
- Mocha
- Chai
- Sinon
- Still deciding on a coveralls and browser testing options.
