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
            return Axios('http://api.ishtar-collective.net/categories/' + string)
        }
    }

})()

export default Ishtar