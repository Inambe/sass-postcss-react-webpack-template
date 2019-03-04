const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// universal config
const config = {
    plugins: [
        new MiniCssExtractPlugin()
    ],
    output: {
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    optimization: {
        splitChunks: {
          chunks: 'all'
        }
    }
}

module.exports = (env, argv) => {
    const isProd = argv.mode == 'production' ? true : false;

    PostcssPlugins = [];
    HtmlWebpackPluginConfig = null;

    if(isProd){
        // for production
        config.output = {
            path: __dirname + '/build'
        };
        PostcssPlugins = [
            require('cssnano'),
            require('autoprefixer')
        ];
        HtmlWebpackPluginConfig = {
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true
            },
            template: 'index.html'
        };

    }else{
        // for development
        config.devServer = {
            contentBase: './dist',
            historyApiFallback: true
        };
        PostcssPlugins = [
            require('autoprefixer')
        ];
        HtmlWebpackPluginConfig = {
            template: 'index.html'
        };
    }

    config.plugins.push(new HtmlWebpackPlugin(HtmlWebpackPluginConfig));

    config.module.rules.push({
        test: /\.(sc|sa|c)ss$/,
        use: [
            { loader: MiniCssExtractPlugin.loader },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                }
            },
            {
                loader: 'postcss-loader',
                options: {
                    plugins: PostcssPlugins
                }
            },
            { loader: 'sass-loader' }
        ]
    });

    return config;
};