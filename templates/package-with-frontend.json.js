module.exports = (self) => {
    return {
        name: self.settings.name,
        version: self.settings.version,
        description: self.settings.description,
        author: self.settings.author,
        main: "src/index.js",
        scripts: {
            "dev": "concurrently -c \"yellow.bold,green.bold\" -n \"SERVER,BUILD\" \"nodemon -w src --exec 'babel-node src --presets env'\" \"cd ./public && npm run dev \"",
            "build": "concurrently -c \"yellow.bold,green.bold\" -n \"SERVER,BUILD\" \"babel src -s -D -d build --presets env\" \"cd ./public && npm run build\"",
            "start": "concurrently -c \"yellow.bold,green.bold\" -n \"SERVER,BUILD\" \"node build\" \"cd ./public && npm start\""
        },
        dependencies: {
            "dotenv": "^6.2.0",
            "express": "^4.16.4",
            "concurrently": "^4.1.0",
            "express-http-proxy": "^1.5.1"
        },
        devDependencies: {
            "babel-cli": "^6.26.0",
            "babel-preset-env": "^1.7.0",
            "mocha": "^6.0.0"
        }
    };
};
