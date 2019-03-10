var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: __dirname + '/public/main.jsx',
  output: { 
    path: __dirname + './public/',
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
