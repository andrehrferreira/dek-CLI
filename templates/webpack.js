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

    return {
        "script": "",
        "import": `
            const webpack = require('webpack');
            const babiliPlugin = require('babili-webpack-plugin');
        `,
        "template": `
            const config = ${JSON.stringify(template, null, 4)};

            if(process.env.NODE_ENV == 'production')
                config.plugins.push(new babiliPlugin())

            module.exports = config;
        `
    };
}
