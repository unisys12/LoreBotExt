const loki = require('lokijs')
const co = require('co')
import Ishtar from '../Ishtar/api'

const db = new loki('grimoire.json')
const defs = db.addCollection('grimoireDefinitions')

let grimoireDefinitions = (()=>{

    function processString(string) {
        return string.replace("'", "&#39;")
    }

    async function fetchDB() {

        let init
        let next
        let data = []
        let cards = []

        try {
            
            init = await Ishtar.allCards()
            for (var i = 0; i < init.data.meta.total_pages; i++) {
                data.push(await Ishtar.getNextSet(i))
            }

            data.forEach(function(element) {
                element.data.grimoire_cards.map((x)=>{
                    cards.push(x)
                })
            }, this);
        
        } catch (error) {
            console.log("Error Fetch Grimoire: ", error)
        }

        if (cards.length < 0) {
            return
        }else{
            let defObj = []

            cards.map((x)=>{
                defObj.push({
                    "_id": x.name,
                    "url": x.ishtar_url,
                    "cardIntro": x.intro,
                    "cardAttribution": x.intro_attribution,
                    "cardDescription": x.description,
                    "cardImage": x.image_url,
                    "categories": x.categories
                })
            })
            return defObj
        }

    }

    async function insertGrimoire() {

        let data = await fetchDB()

        if(data){
            try {
                await defs.insert(data)
            } catch (error) {
                return error
            }
        }else{
            console.log('There was an error inserting docs...') 
        }           

    }

    let fetchCards = async function(string){

        let collData = defs.data

        if(collData.length > 0){          
            let results = defs.find({
                '_id': {
                    '$regex': string
                }
            })
            return results
        }else{
             try {
                 await insertGrimoire()
             } catch (error) {
                 console.log('Error inserting Database: ', error)
             }        
        }

    }

    return {
        fetchCards: fetchCards
    }

})()

export default grimoireDefinitions