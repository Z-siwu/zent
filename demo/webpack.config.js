const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postcssConfig = require('./postcss.config');

const PRODUCTION = process.env.NODE_ENV === 'production';

const postcssLoader = {
  loader: 'postcss-loader',
  options: postcssConfig
};

const plugins = [
  new webpack.EnvironmentPlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV)
    }
  }),

  new CleanWebpackPlugin(['dist']),

  new HtmlWebpackPlugin({
    template: 'client/index.html',
    inject: true
  })
];

if (PRODUCTION) {
  plugins.push(
    new ExtractTextPlugin({ filename: 'styles_[hash].css', allChunks: true })
  );
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      comments: false
    })
  );
}

module.exports = {
  entry: './client/index.js',

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle_[hash].js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },

      {
        test: /\.p?css$/,
        use: PRODUCTION
          ? ExtractTextPlugin.extract({
              fallback: 'style-loader',
              use: ['css-loader', postcssLoader]
            })
          : ['style-loader?sourceMap', 'css-loader?sourceMap', postcssLoader]
      }
    ]
  },

  resolve: {
    alias: {
      common: path.resolve(__dirname, './client/common'),
      components: path.resolve(__dirname, './client/components'),
      api: path.resolve(__dirname, './client/api')
    }
  },

  devtool: PRODUCTION ? false : 'inline-source-map',

  plugins
};
