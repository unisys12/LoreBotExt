'use strict'

import Vue from 'vue'

let header = new Vue({
    el: '#app-header',
    data: {
        message: 'Hello from Vue'
    },
    computed: {
        getAppVersion: function() {
            let pkg = require('../../package.json')
            return pkg.version
        }
    }
})
