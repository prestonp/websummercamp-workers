const path = require('path');
const webpack = require('webpack');
module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app: './app.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: '[name].bundle.js',
    },
    plugins: [
        new webpack.NamedModulesPlugin()
    ]
};
