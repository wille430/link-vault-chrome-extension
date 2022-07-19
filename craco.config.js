const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {

            webpackConfig.optimization = {
                ...webpackConfig.optimization,
                runtimeChunk: false
            }

            Object.assign(webpackConfig.output, {
                filename: 'static/js/[name].js',
            });

            webpackConfig.entry = {
                main: [env === 'development' && require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
                background: './src/background.ts'
            }

            webpackConfig.resolve = {
                ...webpackConfig.resolve,
                fallback: {
                    url: false
                }
            }

            webpackConfig.plugins.push(new CopyPlugin({
                patterns: [
                    {
                        from: "public/manifest.json",
                        to: "./manifest.json"
                    }
                ]
            }))

            webpackConfig.module.rules.push({
                test: /\.(sc|c)ss$i/,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ]
            })

            webpackConfig.devServer = {
                inline: true
            }

            return webpackConfig
        },
    },
    devServer: {
        devMiddleware: {
            writeToDisk: true,
        },
        open: false,
    }
}