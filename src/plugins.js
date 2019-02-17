import 'babel-polyfill';

class Plugins{
    installPlugins(){
        console.log("install plugins");
    }
}

export let installPlugins = new Plugins().installPlugins;

export default async (argv) => {
    let plugins = new Plugins();

    if(argv.h){
        plugins.Help();
    }
    else if(argv._.length > 1){
        //Install Plugins
    }
    else{

    }
};
