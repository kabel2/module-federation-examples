const HtmlWebpackPlugin = require("html-webpack-plugin");
const {ModuleFederationPlugin} = require("webpack").container;
const path = require("path");
const fs = require('fs');
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
module.exports = {
    entry: "./src/index",
    mode: "development",
    devServer: {
        port: 3202,
        'host': 'localhost',
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
            "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
        },
    },
    output: {
        publicPath: "auto",
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                options: {
                    presets: ["@babel/preset-react"],
                    plugins: [
                        require.resolve('react-refresh/babel'),
                    ],
                },
            },
        ],
    },
    plugins: [
        new ModuleFederationPlugin({
            name: "app2",
            library: {type: "var", name: "app2"},
            filename: "remoteEntry.js",
            exposes: {
                "./Button": "./src/Button",
            },
            shared: {react: {singleton: true}, "react-dom": {singleton: true}},
        }),
        new HtmlWebpackPlugin({
            template: "./public/index.html",
        }),
        new webpack.HotModuleReplacementPlugin(),
        new ReactRefreshWebpackPlugin({
            overlay: {
                sockProtocol: 'ws',
                sockHost: 'localhost',
            }
        })
    ],
};
