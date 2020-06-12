const path = require('path')

module.exports = {
  entry: './app/frontend/main.js',
  output: {
    filename: 'main-bundle.js',
    path: path.resolve(__dirname, 'app/public')
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}