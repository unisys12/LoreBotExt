const Axios = require('axios')

let Ishtar = (()=> {

    return {

        allCards: ()=> {
            return Axios('http://api.ishtar-collective.net/cards/')
        },

        getNextSet: (string)=> {
            return Axios('http://api.ishtar-collective.net/cards/page/' + string)
        },

        getItems: (string)=> {
            return Axios('http://api.ishtar-collective.net/items/' + string)
        },

        getCategories: (string)=> {
            return Axios(string)
        },

        processSlug: (string)=>{
            return string
            .replace(':', '')
            .replace('-', '')
            .replace(',', '')
            .replace('&#39;', "")
            .replace(/[.]/g, '')
            .replace(/[^a-zA-Z0-9]/g, '-')
            .replace('--', '-')
            .toLowerCase()           
        }
    }

})()

export default Ishtar
