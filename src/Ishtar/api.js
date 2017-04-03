const Axios = require('axios')

let Ishtar = (()=> {

    return {
        getCards: (string)=> {
            return Axios('http://api.ishtar-collective.net/cards/' + string)
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
            .replace(/['&#39;']/g, "")
            .replace(/[^a-zA-Z0-9]/g, '-')
            .toLowerCase()
        }
    }

})()

export default Ishtar