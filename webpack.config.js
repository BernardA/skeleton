/* eslint-disable global-require */
const { InjectManifest } = require('workbox-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const path = require('path');
// const StyleExtHtmlWebpackPlugin = require("style-ext-html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './client/index.js',
    output: {
        // path: __dirname + '/public/dist',
        path: path.resolve(__dirname, 'public/dist'),
        filename: '[name].[contenthash].js',
        publicPath: '/dist/',
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: [
                    ExtractCssChunks.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: loader => [
                                require('postcss-import')({
                                    root: loader.resourcePath,
                                }),
                                require('postcss-preset-env')(),
                                require('autoprefixer')(),
                                require('cssnano')(),
                            ],
                        },
                    },
                ],
            },
        ],
    },
    plugins: [
        new HardSourceWebpackPlugin(),
        new CleanWebpackPlugin(),
        new ExtractCssChunks(
            // old new MiniCssExtractPlugin( note sideEffect config on package.json for production
            {
                filename: '[name].[contenthash].css',
                chunkFilename: '[id].css',
            },
        ),
        new HtmlWebpackPlugin({
            showErrors: true,
            template: 'templates/webpack.html.twig', // base template
            filename: '../../templates/base.html.twig', // output
            inlineSource: '.(css)$', // embed all css inline
        }),
        // disable for development
        // new HtmlWebpackInlineSourcePlugin(),
        // new StyleExtHtmlWebpackPlugin(),
        // disable copy while in development
        /*
        new CopyWebpackPlugin([
            {
                from: './assets/img/',
                to: '../img-cache/[name].070219.[ext]',
                //to: '../img/'
            },
        ]),
        */
        new ManifestPlugin(),
        new InjectManifest({
            swSrc: './client/sw-src.js',
            swDest: '../sw.js',
            exclude: [/\.twig$/, /\.DS*/],
        }),
    ],
};
