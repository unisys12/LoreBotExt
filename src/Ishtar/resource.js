"use strict"

const api = require("./api")

let Ishtar = (() => {

    // Private Methods

    let fetchItem = (item) => {

        return new Promise((resolve, reject) => {

            api.getItem(item)
                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

        })

    }

    let fetchCategory = (string) => {

        return new Promise((resolve, reject) => {

            api.getCategory(string)
                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

        })

    }

    let fetchCard = (string) => {

        return new Promise((resolve, reject) => {

            api.getCard(string)
                .then((response) => {
                    resolve(response)
                })

                .catch((error) => {
                    reject(error)
                })

        })

    }

    // Public Methods

    let getItem = (item) => {
        fetchItem(item)
        .then((result) => {
            return result
        }, (err) => {
            return err
        })
    }

    let getCategory = (string) => {
        fetchCategory(string)
        .then((result) => {
            return result
        }, (err) => {
            return err
        })
    }

    let getCard = (string) => {
        fetchCard(string)
        .then((result) => {
            return result
        }, (err) => {
            return err
        })
    }

    return {
        getItem: getItem,
        getCategory: getCategory,
        getCard: getCard
    }

})()

module.exports.Ishtar = Ishtar
