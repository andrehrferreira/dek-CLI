let path = require("path");

module.exports = (self) => {
    var template = {
        entry: path.join(self.settings.path, 'public/src', 'main.js'),
        output: {
            path: path.join(self.settings.path, 'public/build'),
            publicPath: "public/build",
            filename: 'bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    query: {
                        presets: ['es2015']
                    }
                },
                {
                    test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/font-woff'
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=application/octet-stream'
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
                }
            ]
        },
        devtool: 'source-map',
        plugins: []
    };

    try{
        switch(self.settings.templateEngine){
            case "vue":
                template.module.rules.push({
                    test: /\.vue$/,
                    exclude: /node_modules/,
                    loader: 'vue-loader'
                });
            break;
            case "react":
                //template.module.rules[0].query.presets.push("react");
            break;
            case "angular": break;
            default: break;
        }
    } catch(e){ }

    return `
const webpack = require("webpack");
const babiliPlugin = require("babili-webpack-plugin");
const extractTextPlugin = require("extract-text-webpack-plugin");
const optimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = ${JSON.stringify(template, null, 4)};

config.plugins.push(new extractTextPlugin("styles.css"));

config.module.rules.push({
    test: new RegExp("\\\.css$"),
    use: extractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
    })
});

if(process.env.NODE_ENV == "production"){
    config.plugins.push(new babiliPlugin());

    config.plugins.push(new optimizeCSSAssetsPlugin({
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
            discardComments: {
                removeAll: true
            }
        },
        canPrint: true
    }));
}

module.exports = config;
    `;
}
