const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ExtensionReloader = require('webpack-ext-reloader')

const baseConfig = {

    entry: {
        popup: './src/popup/Index.tsx',
        background: './src/background/index.ts',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'static/js/[name].js',
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: 'public/manifest.json',
                    to: './manifest.json',
                },
                {
                    from: 'public/images/',
                    to: 'images/'
                }
            ],
        }),
        new HtmlWebpackPlugin({
            template: 'src/popup/popup.html',
            filename: 'popup.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].css',
            chunkFilename: '[id].css',
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(s(a|c)ss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass'),
                        },
                    },
                ],
            },
            {
                test: /\.t(sx|s)?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        inline: true,
    },
    optimization: {
        runtimeChunk: false,
    },
    resolve: {
        extensions: ['*', '.tsx', '.ts', '.js'],
    },
    watchOptions: {
        ignored: /node_modules/,
    },
    devtool: 'cheap-module-source-map',
}

const createConfig = () => {
    const config = baseConfig;

    if (Boolean(process.env.WATCH) === true) {
        config.mode = "development"
        config.plugins.push(
            new ExtensionReloader({
                entries: {
                    popup: 'popup',
                    background: 'background',
                },
                reloadPage: true,
            }),
        )
    }

    return config
}

module.exports = createConfig()
