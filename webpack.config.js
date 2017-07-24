const { resolve } = require('path')

const webpack = require('webpack')
const HappyPack = require('happypack')

const config = require('./config')

const plugins = [
  new webpack.EnvironmentPlugin([ "NODE_ENV" ]),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.NamedModulesPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    children: true,
    async: true,
    minChunks: Infinity
  }),
  new HappyPack({
    verbose: false,
    id: 'js',
    threads: 2,
    loaders: [{
      path: 'babel-loader',
      query: {
        presets: [ 'es2015', 'stage-1', 'react' ],
        cacheDirectory: true
      }
    }]
  }),
  process.env.NODE_ENV == 'production'
    ? new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true
        },
        output: { comments: false }
      })
    : new webpack.HotModuleReplacementPlugin()
]

module.exports = {
  devtool: process.env.NODE_ENV == 'production' ? '' : 'inline-source-map',
  cache: true,
  context: resolve(__dirname, 'client'),
  entry: { bundle: './main.js' },
  output: {
    path: resolve(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: [ /node_modules/ ], use: ['happypack/loader?id=js'] },
      { test: /\.html/, loader: 'html-loader' }
    ]
  },
  plugins,
  devServer: {
    historyApiFallback: true,
    contentBase: resolve(__dirname, 'public'),
    hot: process.env.NODE_ENV == 'development',
    publicPath: '/',
    port: config.devServerPort,
    proxy: {
      '/api': { target: `http://localhost:${config.serverPort}/`, secure: false }
    },
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: false,
      warnings: true
    }
  }
}
