var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/')
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
var pixi = path.join(phaserModule, 'build/custom/pixi.js')
var p2 = path.join(phaserModule, 'build/custom/p2.js')
// var phaserSlopes = path.join(__dirname, '/node_modules/phaser-arcade-slopes/dist/phaser-arcade-slopes.min.js')
var phaserSlopes = path.join(__dirname, '/node_modules/phaser-arcade-slopes/dist/phaser-arcade-slopes.js')
// var SAT = path.join(__dirname, '/node_modules/sat/SAT.min.js')
var SAT = path.join(__dirname, '/node_modules/sat/SAT.js')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
})

module.exports = {
    entry: {
        app: [
            'babel-polyfill',
            path.resolve(__dirname, 'src/main.js')
        ],
        vendor: ['pixi', 'p2', 'phaser', 'webfontloader', 'SAT']
    },
    devtool: 'cheap-source-map',
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, 'dist'),
        publicPath: './dist/',
        filename: 'bundle.js'
    },
    watch: true, watchOptions: {
        poll: 1500
    },
    plugins: [
        definePlugin,
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'/* chunkName= */,
            filename: 'vendor.bundle.js'/* filename= */
        }),
        new HtmlWebpackPlugin({
            filename: '../index.html',
            template: './src/index.html',
            chunks: ['vendor', 'app'],
            chunksSortMode: 'manual',
            minify: {
                removeAttributeQuotes: false,
                collapseWhitespace: false,
                html5: false,
                minifyCSS: false,
                minifyJS: false,
                minifyURLs: false,
                removeComments: false,
                removeEmptyAttributes: false
            },
            hash: false
        }),
        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            server: {
                baseDir: ['./', './build']
            }
        })
    ],
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src')},
            {test: /pixi\.js/, use: ['expose-loader?PIXI']},
            {test: /phaser-split\.js$/, use: ['expose-loader?Phaser']},
            {test: /p2\.js/, use: ['expose-loader?p2']},
            {test: /lodash\.js/, use: ['expose-loader?_!lodash']},

            {test: /SAT\.js$/, use: ['expose-loader?SAT']},
            {test: /phaser-arcade-slopes\.js$/, use: ['expose-loader?phaserSlopes']}
            // {test: /SAT\.min\.js$/, use: ['expose-loader?SAT']},
            // {test: /phaser-arcade-slopes\.min\.js$/, use: ['expose-loader?phaserSlopes']}

        ]
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    resolve: {
        alias: {
            'phaser': phaser,
            'pixi': pixi,
            'p2': p2,
            'phaserSlopes': phaserSlopes,
            'SAT': SAT,
        }
    }
}
