var path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const PATHS = {
  src: __dirname,
  dist: path.join(__dirname, "./build")
};

module.exports = {
  mode: 'development',

  entry: {
    app: [PATHS.src]
  },

  output: {
    // library: 'App'
    path: PATHS.dist,
    filename: "bundle.js"
  },
  
  devtool: 'source-map',

  devServer: {
    // contentBase: __dirname,
    hot: true, // hot module replacement while application running
    inline: true, // a script inserted in bundle for live reloading
    progress: true, // output running progress to console.
    disableHostCheck: true, //bypasses host checking
    open: true, // open the browser after server started
    stats: { colors: true }, //whether to output in the different colors
    watchOptions: { poll: true }, //watching file changes use polling
    // writeToDisk: true, //whether output bundle.js, vender.bundle.js, and index.html
    // host: "0.0.0.0",
    port: 7070
  },
  
  module: {
    rules: [
      {
        // Transpile ES6 to ES5 with babel
        // Remove if your app does not use JSX or you don't need to support old browsers
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          presets: ['@babel/preset-react']
        }
      }
    ]
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: "./index.html",
      path: PATHS.dist,
      filename: "index.html"
    })
  ]
};