const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: ['@babel/polyfill', './src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/style.css',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
    new CopyPlugin({
      patterns: [{ from: './src/img', to: 'img' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]ss|css)$/i,
        // 把 sass-loader 放在首要處理 (第一步)
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // {
          // loader: 'px2rem-loader',
          // // options here
          // options: {
          //   remUni: 37.5,
          // remPrecision: 8,
          //   },
          // },
          {
            loader: 'postcss-loader',
            options: {
              // 傳遞 plugins 選項並載入 autoprefixer 做使用 (第二步)
              plugins: [autoprefixer()],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|jpg|gif|jpe?g|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'img/[name].[ext]',
              outputPath: 'img',
            },
          },
        ],
      },
    ],
  },
}
