'use strict'

let path = require('path')

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: 'index.js',
        path: './dist/'
    },
    devtool: 'source-map',
    module: {
        loaders:[{
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                presets: ["env"]
            }
        }]
    },
    node: { fs: 'empty' },
    plugins: []
}