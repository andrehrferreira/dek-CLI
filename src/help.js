import '@babel/polyfill/noConflict';

export default async () => {
    const usageText = `     Usage:
        $ dek <command>

        commands can be:

        init:       used to create a new project
        install:    used to install plugins/dependencies
        update:     used to update plugins/dependencies
        new:        used to create new plugin or controller
        help:       used to print the usage guide

        dek <command> -h quick help on <command>

    Examples:
        $ dek init
        $ dek install mongodb redis
        $ dek new plugin
  `

      console.log(usageText)
}
