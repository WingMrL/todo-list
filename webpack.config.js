var path = require('path');

module.exports = {
    entry: {
        "index": "./js/index.js"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js|jsx$/,
                use: {
                    loader: 'babel-loader'
                },
                include: [path.resolve(__dirname, "js")],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader"
                ],
                include: [path.resolve(__dirname, "style")],
                exclude: /node_modules/
            }
        ]
    }
};