var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
require("babel-core/register");

var nodePath = path.join(__dirname, "node_modules");

module.exports = {

  context: __dirname + "/client",
  entry: {
    app: "./scripts/main.jsx",
    html: "./index.html"
  },

  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
    sourceMapFilename: "[file].map",
    publicPath: __dirname + "/dist/"
  },

  resolve: {
    cache: true,
    alias: {
      "lodash" : "lodash",
      "jQuery" : "jquery",
    },
    extensions: ["", ".js", ".json", ".coffee", ".css"]
   },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",
        query: {
          presets: ['react', 'es2015']
        }
      },
      {
        test: /\.html$/,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.(woff2|woff|ttf|eot)$/,
        loader: "file?name=fonts/[name].[ext]",
      },
      {
        test: /\.(css|less)$/,
        loader: ExtractTextPlugin.extract("css-loader!less-loader")
      },
      {
        test: /\.(png|jpg|svg|ico)$/,
        loader: "file-loader?name=[path][name].[ext]"
      },
    ],

  },
  plugins: [
    new ExtractTextPlugin("[name].css", {
      allChunks: true
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],

  devtool: "source-map",
}