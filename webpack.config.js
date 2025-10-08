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
            title: "Domowy Janusz"
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public/manifest.json', to: 'manifest.json' },
                { from: 'public/apple-touch-icon.png', to: 'apple-touch-icon.png' },
                { from: 'public/favicon-16x16.png', to: 'favicon-16x16.png' },
                { from: 'public/favicon-32x32.png', to: 'favicon-32x32.png' },
                { from: 'public/android-chrome-192x192.png', to: 'android-chrome-192x192.png' },
                { from: 'public/android-chrome-512x512.png', to: 'android-chrome-512x512.png' },
            ],
        }),
    ],
    mode: 'development',
};