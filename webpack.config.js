var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: './public/main.jsx',
  output: {
    path: './public/',
    filename: "build.js",
  },
  
  module: {
    loaders: [
      {
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css-loader!sass-loader')}
    ]
  },
  plugins: [
    new ExtractTextPlugin("/stylesheets/zorogolf.css")
  ]
};
