const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/app-logic/index.js',
    devtool: 'inline-source-map',
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};