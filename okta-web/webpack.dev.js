const path = require('path');
const webpack = require("webpack");
const Dotenv = require('dotenv-webpack');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const openBrowser = require('react-dev-utils/openBrowser');

const host = process.env.HOST || 'localhost';
const port = parseInt(process.env.PORT, 10) || 3000;

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        clean: true
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        client: {
            logging: 'info',
            progress: true,
        },
        historyApiFallback: true,
        onListening: () => {
            openBrowser(`http://${host}:${port}`);
        },
        port,
        host
    },
    module: {
        rules: [
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: ['file-loader'],
            },
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jsx|js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                targets: "defaults"
                            }],
                            ['@babel/preset-react', {
                                runtime: "automatic"
                            }]
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new Dotenv({ path: ".env.local" }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "public", "index.html"),
        }),
        new webpack.DefinePlugin({
            "process.env.PUBLIC_URL": "./"
        }),
        new CopyPlugin({
            patterns: [
                { from: 'public/manifest.json', to: 'manifest.json' },
                { from: 'public/favicon.ico', to: 'favicon.ico' },
                { from: 'public/logo192.png', to: 'logo192.png' },
                { from: 'public/logo512.png', to: 'logo512.png' },
            ]
        }),
    ]
}