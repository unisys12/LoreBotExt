const loki = require('lokijs')
const co = require('co')
import DestinyQueries from './DestinyQueries'

const db = new loki('grimoire.db')
const defs = db.addCollection('grimoireDefinitions')

let grimoireDefinitions = (()=>{

    let fetchDB = co.wrap(function *(){
        console.log('Fetching Grimoire Data...')
        let dbres = yield destinyQueries.grimoireDefinition()
          
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

    })

    let insertGrimoire = co.wrap(function *(){

        let data = yield fetchDB()

        if(data.status === 200 ){
            console.log('Inserting Grimoire Data into in-memory DB...')
            defs.insert(defObj)
        }else{
            console.log('There was an error inserting docs...', data.statusText)
            return data.statusText
        }           

    })

    let fetchCards = co.wrap(function *(string){

        if(db){
            let results = defs.find({
                cardName: {
                    '$regex': '/'+string+'/'
                }
            })

            return results
        }else{
            insertGrimoire()
        }

    })

    return {
        // Public Methods
        fetchCards: fetchCards
    }

})()

export default grimoireDefinitions