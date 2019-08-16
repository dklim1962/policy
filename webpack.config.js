const path = require('path');

const {
  NoEmitOnErrorsPlugin,
  HotModuleReplacementPlugin,
} = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => ({
  entry: './src/index.tsx',
  output: {
    filename: 'app.[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|tsx?)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
          // 'eslint-loader',
        ],
      },
      {
        test: /\.md$/,
        use: [
          'raw-loader',
        ],
      },
      {
        include: /public\//,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: argv.mode !== 'production' ? '[name].[ext]' : '[contenthash].[ext]',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'src'),
      'node_modules',
    ],
  },
  plugins: [
    new NoEmitOnErrorsPlugin(),
    new HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      minify: {
        collapseWhitespace: true,
        processConditionalComments: true,
        minifyJS: argv.mode === 'production',
      },
    }),
  ],
  devtool: argv.mode !== 'production' ?  'cheap-module-eval-source-map' : 'cheap-source-map',
  devServer: {
    compress: true,
    disableHostCheck: true,
    host: '0.0.0.0',
    hot: true,
    open: false,
    port: 9000,
    public: process.env.SELECT_URL,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        sourceMap: true,
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
});
