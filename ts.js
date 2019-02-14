let npm = require("npm");
let package = require("./package.json");
let fs = require("fs");

npm.load({}, function(err){
    var script = "react react-dom --save && babel-preset-react --save-dev";
    var sepScript = script.split("&&");

    sepScript.forEach((parScript) => {
        if(/--save-dev/.test(parScript)){
            parScript = parScript.replace("--save-dev", "");

            parScript.split(" ").forEach((dependency) => {
                if(dependency && dependency != ""){
                    npm.commands.show([dependency, 'name'], function(er, rawData){
                        package.devDependencies[dependency] = "^" + Object.keys(rawData)[0];
                    });
                }
            });
        } else {
            parScript = parScript.replace("--save", "");

            parScript.split(" ").forEach((dependency) => {
                if(dependency && dependency != ""){
                    npm.commands.show([dependency, 'name'], function(er, rawData){
                        package.dependencies[dependency] = "^" + Object.keys(rawData)[0];
                    });
                }
            });
        }
    });
});
