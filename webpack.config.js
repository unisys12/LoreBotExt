'use strict'

let path = require('path')
let CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    entry: './src/core.js',
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
    plugins: [
        new CopyWebpackPlugin([
            { from: './src/images/', to: 'images/' },
            { from: './src/index.html', to: '.' },
            { from: './src/manifest.json', to: '.'},
            { from: './src/background.js', to: '.' }
        ], 
            { copyUnmodified: true } // when we get watch up and going, we can remove this
        )
    ]
}