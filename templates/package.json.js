module.exports = (self) => {
    return {
        name: self.settings.name,
        version: self.settings.version,
        description: self.settings.description,
        author: self.settings.author,
        main: "src/index.js",
        scripts: {
            "test": "npm run build && mocha",
            "dev": "nodemon -w src --exec \"babel-node src --presets env\"",
            "build": "babel src -s -D -d build --presets env",
            "start": "npm run build && node build"
        },
        devDependencies: {},
        dependencies: {}
    };
};
