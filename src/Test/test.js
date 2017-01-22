"use strict"

const TestModule = (() => {

    let privateMethod = (string) => {
        return string.toLowerCase()
    }

    let publicMethod = (text) => {
        return privateMethod(text)
    }

    return {
        publicMethod: publicMethod
    }

})()

module.exports.TestModule = TestModule
