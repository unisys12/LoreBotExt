### Project Goals
Create a browser extension that, once enabled, will allow the user to play Destiny and get Grimoire as well as other game related lore delivered to their browser in real time. In short, try to get as close to giving the player "in-game lore" without our code actually being in the game.

### Proposed Project Means
I propose to accomplish this, hopefully with some help from the community _(web dev and game alike)_ using a fairly modern web development structure and deliver it as a Chrome Extension. This means, delivering all the content by way of not using a server to serve pages or to generate dynamic content. To do this, the project will have to be built using one of the many Javascript frameworks in the market today. I have decided on Vuejs..., well, because I like it and doesn't seem as complicated as many of the other frameworks popular today. Later, I would like to make this available to Firefox users as well, but need to get this running on Chrome first I think.

I will be leveraging (https://www.bungie.net/platform/destiny/help/)[Bungies Public API] for anything related to character data,  the monitoring of activities, as well as the fetching of activity related Grimoire. There is a slight catch to the Grimoire though. I have a version of Bungie API help with an instance of MongoDB. This is where I am pulling the Grimoire card data from. Since I am unable to get MongoDB to work in the browser, I am utilizing a project titled (http://lokijs.org)[Lokijs], which is an in-memory database that I am using to query against. All the Grimoire based Category information will be obtained using the Open API provided by (https://www.ishtar-collective.net)[Ishtar Collective], with the approval of Baxter... owner of the later API. 

###Blah-Blah-Blah, But how do you use it?
Simple, add the extension to Chrome from the Playstore _(link is coming, still testing at the moment)_ and the green Embalming Orb that you should now see in your extension tray of Chrome. Once the page launches, just enter the gamertag _(not just someone's Twitch handle, but a valid BNet gamertag)_ and press the button titled, _Get Characters_. That's it!

If the entered gamertag is valid and currently in an activity, you should see something like the following: 

![Character & Activity Summary](https://drive.google.com/uc?export=view&id=0B-kKCIm8tW4gQWtBR2stY0N0ZDQ)

If there is an error either with the Bungie API or the entered gamertag, you will see that in the notifications area below:
![Summary Fetch Error..](https://drive.google.com/uc?export=view&id=0B-kKCIm8tW4gajJXcVAwR3Zna0E)

After this is displayed, give the extension a few seconds to download and insert the Grimoire Database. At this time, you should see and relavent Grimoire Cards related to the name of this activity, like so: 
![Displaying Grimoire Cards](https://drive.google.com/uc?export=view&id=0B-kKCIm8tW4gR1NPTVJNck1pTFE)

Around the sametime as this, you will be able to see if there are any further references to this activity by checking the Categories section at the bottom. There you will find very simple boxes, housing links to Ishtar-Collective.Net covering each of the categories listed. If no categories are assocated with the cards or activity, then you will see a message saying so. Remember, the categories section is a curated list that is put together by hard working members of the Destiny Lore community and not pulled from the Bungie API.

###Known Issues
- If you enter a new gamertag, without refreshing your browser first and that new gamertag is not in an activity, the display does not update to reflect that activity change.