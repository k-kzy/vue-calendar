import glob from 'glob';
import path from 'path';
const VueLoaderPlugin = require('vue-loader/lib/plugin')
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const absolutePath = {
  src: path.resolve(__dirname, 'src'),
  dist: path.resolve(__dirname, 'dist')
};

// TODO entryまとめてやる処理だけど適当なのはすまんな…
const entry = glob.sync('./src/**/*.?(html|css|scss|js|json)').reduce((previous, current) => {
  const key = current.indexOf('.scss') !== -1 ? current.replace(/scss/g, 'css') : current;
  const keyReplace = key.replace(/^\.\/src\//, '');

  previous[keyReplace] = current.indexOf('.js') !== -1 ?
    ['babel-polyfill', current.replace(/\/src/, '')] :
    current.replace(/\/src/, '');

  return previous;
}, {});

const module = {
  rules: [
    {
      test: /\.html$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract('html-loader')
    },
    {
      test: /\.json$/,
      loader: 'json-loader'
    },
    {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader']
    },
    {
      test: /.vue$/,
      loader: 'vue-loader',
      options: {
        loaders: {
          css: {
            loader: 'css-loader'
          },
          scss: {
            loader: 'sass-loader'
          }
        }
      }
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        },
        {
          loader: 'eslint-loader'
        }
      ]
    },
    {
      test: /\.(jpg|png|gif)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[path][name].[ext]',
            publicPath: path => `../${path}`
          }
        }
      ],
    }
  ]
};

export default {
  context: absolutePath.src,
  entry,
  output: {
    path: absolutePath.dist,
    filename: '[name]',
  },
  devServer: {
    contentBase: absolutePath.dist,
    publicPath: '/',
    port: '8080'
  },
  module,
  plugins: [
    new VueLoaderPlugin(),
    new ExtractTextPlugin('[name]')
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
      vuex: 'vuex/dist/vuex.js'
    },
    extensions: ['.js', '.vue']
  }
};
