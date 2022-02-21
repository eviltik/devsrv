const { Command } = require( 'commander' );
const config = require( './default.js' );
const pack = require( '../package.json' );
const configHelper = require( './config.js' );

const program = new Command();

function setProgramOptions( program, config ) {

    configHelper.clean( config );

    let option;
    Object.keys( config ).forEach( key => {

        option = config [ key ];
        program.option( option.opt, option.help, option.value );

    } );

}



program
    .name( pack.name )
    .description( pack.description )
    .version( pack.version );

setProgramOptions( program, config );

program.parse( process.argv );

module.exports = {
    opts:program.opts()
};
