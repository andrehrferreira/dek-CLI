module.exports = (self) => {
    return {
        name: self.settings.name,
        version: self.settings.version,
        description: self.settings.description,
        author: self.settings.author,
        main: "src/index.js",
        scripts: {
            "dev": "nodemon -w src --exec \"babel-node src --presets env\"",
            "build": "babel src -s -D -d build --presets env",
            "start": "node build"
        },
        dependencies: {
            "@dekproject/routes": "latest",
            "@dekproject/scope": "latest",
            "dotenv": "^6.2.0",
            "express": "^4.16.4"
        },
        devDependencies: {
            "babel-cli": "^6.26.0",
            "babel-preset-env": "^1.7.0",
            "mocha": "^6.0.0"
        }
    };
};
