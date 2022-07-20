
const path = require("path")
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtensionReloader = require("webpack-ext-reloader");

module.exports = {
    mode: "development",
    entry: {
        popup: "./src/popup/Popup.tsx",
        background: "./src/background.ts"
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "static/js/[name].js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: "public/manifest.json",
                    to: "./manifest.json"
                }
            ]
        }),
        new HtmlWebpackPlugin({
            template: "src/popup/Popup.html",
            filename: "Popup.html"
        }),
        new MiniCssExtractPlugin({
            filename: "static/css/[name].css",
            chunkFilename: "[id].css"
        }),
        new ExtensionReloader({
            entries: {
                background: "./src/background.ts",
                popup: "./src/popup/Popup.tsx"
            },
            reloadPage: true
        })
    ],
    module: {
        rules: [
            {
                test: /\.(s(a|c)ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            implementation: require("sass")
                        }
                    },
                ]
            },
            {
                test: /\.t(sx|s)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ]
    },
    devServer: {
        inline: true
    },
    optimization: {
        runtimeChunk: false
    },
    resolve: {
        extensions: ['*', '.tsx', '.ts', '.js']
    },
    watchOptions: {
        ignored: /node_modules/
    },
    devtool: 'cheap-module-source-map'
}