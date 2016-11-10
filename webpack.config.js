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
      }
    ]
  }
};
