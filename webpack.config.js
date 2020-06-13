const path = require('path')

module.exports = {
  entry: './src/frontend/main.js',
  output: {
    filename: 'main-bundle.js',
    path: path.resolve(__dirname, '/src/public')
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