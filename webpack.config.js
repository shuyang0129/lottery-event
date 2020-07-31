const path = require('path')
const autoprefixer = require('autoprefixer')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const pxtorem = require('postcss-plugin-px2rem')
const Dotenv = require('dotenv-webpack')

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
      // 當img/資料夾，原封不動複製到打包後的dist/資料夾裡
      patterns: [{ from: './src/img', to: 'img' }],
    }),
    new Dotenv({
      path: `./.env.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}`,
      systemvars: true, // 允許讀取 process.env 下的任意系統變量
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
          {
            loader: 'postcss-loader',
            options: {
              // 傳遞 plugins 選項並載入 autoprefixer 做使用 (第二步)
              plugins: [
                autoprefixer(),
                pxtorem({
                  rootValue: 37.5, //换算基数， 默认100  ，这样的话把根标签的字体规定为1rem为50px,这样就可以从设计稿上量出多少个px直接在代码中写多上px了。
                  // unitPrecision: 5, //允许REM单位增长到的十进制数字。
                  // propWhiteList: [],  //默认值是一个空数组，这意味着禁用白名单并启用所有属性。
                  // propBlackList: [], //黑名单
                  exclude: /(node_module)/, //默认false，可以（reg）利用正则表达式排除某些文件夹的方法，例如/(node_module)/ 。如果想把前端UI框架内的px也转换成rem，请把此属性设为默认值
                  selectorBlackList: ['html'], //要忽略并保留为px的选择器
                  // ignoreIdentifier: false,  //（boolean/string）忽略单个属性的方法，启用ignoreidentifier后，replace将自动设置为true。
                  // replace: true, // （布尔值）替换包含REM的规则，而不是添加回退。
                  mediaQuery: false, //（布尔值）允许在媒体查询中转换px。
                  minPixelValue: 3, //设置要替换的最小像素值(3px会被转rem)。 默认 0
                }),
              ],
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
