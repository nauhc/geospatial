// NOTE: To use this example standalone (e.g. outside of deck.gl repo)
// delete the local development overrides at the bottom of this file

const CONFIG = {
  mode: 'development',

  entry: {
    app: './app.js'
  },

  output: {
    library: 'App'
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
    port: 7000
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
  }
};

// This line enables bundling against src in this repo rather than installed module
module.exports = env => (env ? require('../../webpack.config.local')(CONFIG)(env) : CONFIG);