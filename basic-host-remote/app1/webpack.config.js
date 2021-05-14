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
        port: 3201,
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
                test: /bootstrap\.js$/,
                loader: "bundle-loader",
                options: {
                    lazy: true,
                },
            },
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
    //http://localhost:3002/remoteEntry.js
    plugins: [
        new ModuleFederationPlugin({
            name: "app1",
            remotes: {
                app2: `app2@${getRemoteEntryUrl(3202)}`,
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

function getRemoteEntryUrl(port) {
    const {CODESANDBOX_SSE, HOSTNAME = ''} = process.env;

    // Check if the example is running on codesandbox
    // https://codesandbox.io/docs/environment
    if (!CODESANDBOX_SSE) {
        return `//localhost:${port}/remoteEntry.js`;
    }

    const parts = HOSTNAME.split('-')
    const codesandboxId = parts[parts.length - 1]

    return `//${codesandboxId}-${port}.sse.codesandbox.io/remoteEntry.js`;
}
