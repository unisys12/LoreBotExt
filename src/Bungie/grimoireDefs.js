const loki = require('lokijs')
const co = require('co')
import DestinyQueries from './DestinyQueries'

const db = new loki('grimoire.json')
const defs = db.addCollection('grimoireDefinitions')

let grimoireDefinitions = (()=>{

    async function fetchDB() {

        let dbres

        try {
            dbres = await DestinyQueries.grimoireDefinition()
        } catch (error) {
            return error
        }

        if (!dbres) {
            return
        }else{
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