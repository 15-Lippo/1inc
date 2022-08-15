import 'webpack-dev-server';

import BundleDeclarationsWebpackPlugin from 'bundle-declarations-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { resolve } from 'path';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
// @ts-ignore
import { Configuration, DefinePlugin } from 'webpack';

const config: Configuration = {
  entry: './src/index.tsx',
  // entry: "./src/main.ts",
  ...(process.env.production || !process.env.development ? {} : { devtool: 'eval-source-map' }),
  output: {
    filename: 'index.js',
    path: resolve('./dist'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    alias: {
      process: 'process/browser',
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
        exclude: /build/,
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        // style-loader creates style nodes from JS strings
        // css-loader translates CSS into CommonJS
        // sass-loader compiles Sass to CSS
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  devServer: {
    host: 'localhost',
    port: 3001,
    compress: true,
    open: true,
    historyApiFallback: { disableDotRule: true },
  },
  plugins: [
    new BundleDeclarationsWebpackPlugin({
      entry: ['./src/index.tsx'],
      outFile: 'index.d.ts',
    }),
    new HtmlWebpackPlugin({
      title: 'Yozh-Widget',
      template: './public/index.html',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
      },
    }),
    // DefinePlugin allows you to create global constants which can be configured at compile time
    new DefinePlugin({
      'process.env': process.env.production || !process.env.development,
    }),
    new ForkTsCheckerWebpackPlugin(),
  ],
};

export default config;
