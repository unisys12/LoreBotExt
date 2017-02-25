'use strict'

let path = require('path')
let CopyWebpackPlugin = require('copy-webpack-plugin')
let ExtractTextPlugin = require('extract-text-webpack-plugin')

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
    plugins: []
}