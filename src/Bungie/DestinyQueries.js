const Axios = require('axios')


let DestinyQueries = (() => {

    let grimoireDefinition = () => {

        return Axios('https://api.mlab.com/api/1/databases/heroku_6nc0xjkc/collections/destiny.manifest.en.DestinyGrimoireCardDefinition?&apiKey=ShN1TAeW8nvttOxjQJlatqmXuQ8RIdVE')

    }

    return { grimoireDefinition: grimoireDefinition }

})()

export default DestinyQueries