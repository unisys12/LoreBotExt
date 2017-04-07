'use strict'
const webpack = require('webpack')
const path = require('path')
const DotenvPlugin = require('webpack-dotenv-plugin')

module.exports = {
    entry: ['babel-polyfill', './src/index.js'],
    output: {
        filename: 'index.js',
        path: './dist/'
    },
    devtool: 'nosources-source-map',
    module: {
        loaders:[
        {
            test: /\.js$/,
            include: path.join(__dirname, 'src'),
            loader: 'babel-loader',
            query: {
                presets: ["env"]
            }
        },
        {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                scss: 'vue-style-loader!css-loader!sass-loader', // <style lang="scss">
                sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax' // <style lang="sass">
                }
            }
        }
        ]
    },
    node: { fs: 'empty' },
    plugins: [
        new DotenvPlugin({
            sample: './.env.default',
            path: './.env'
        })
    ]
}