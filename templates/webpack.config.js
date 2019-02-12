let path = require("path");

module.exports = (self) => {
    var template = {
        entry: path.join(self.settings.path, 'public', 'main.js'),
        output: {
            path: path.join(self.settings.path, 'public'),
            filename: 'bundle.js'
        },
        optimization: {
            splitChunks: {
                chunks: 'all'
            }
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
                }
            ]
        },
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
                template.module.rules[0].query.presets.push("react");
            break;
            case "angular": break;
            default: break;
        }
    } catch(e){ }

    return `
const HtmlWebpackPlugin = require('html-webpack-plugin');
const env = process.env.NODE_ENV;

const config = ${JSON.stringify(template, null, 4)};

module.exports = config;`;

}
