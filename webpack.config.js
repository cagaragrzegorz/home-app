const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        clean: true,
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.mp3$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/sounds/[name][hash][ext][query]',
                },
            },
        ],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        port: 3000,
        historyApiFallback: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            favicon: './public/favicon.ico',
            title: "Home Janusz"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/manifest.json', to: 'manifest.json' },
                { from: 'public/apple-touch-icon.png', to: 'apple-touch-icon.png' },
            ],
        }),
    ],
    mode: 'development',
};