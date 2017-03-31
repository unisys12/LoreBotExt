const loki = require('lokijs')
const co = require('co')
import DestinyQueries from './DestinyQueries'

const db = new loki('grimoire.json')
const defs = db.addCollection('grimoireDefinitions')

let grimoireDefinitions = (()=>{

    async function fetchDB() {

        let dbres = await DestinyQueries.grimoireDefinition()

        if (dbres.status === 200) {
            let dbresData = dbres.data
            let defObj = []

            dbresData.map((x)=>{
                defObj.push({
                    "_id": x.cardName,
                    "cardIntro": x.cardIntro,
                    "cardDescription": x.cardDescription,
                    "cardImage": x.highResolution.image.sheetPath
                })
            })
            return defObj            
        }else{
            return dbres
        }

    }

    async function insertGrimoire() {

        let data = await fetchDB()

        if(data){
            await defs.insert(data)
        }else{
            console.log('There was an error inserting docs...') 
        }           

    }

    let fetchCards = co.wrap(function *(string){

        let collData = defs.data

        if(collData.length > 0){            
            let results = defs.find({
                '_id': {
                    '$regex': string
                }
            })
            return results
        }else{
            yield insertGrimoire()        
        }

    })

    return {
        fetchCards: fetchCards
    }

})()

export default grimoireDefinitions