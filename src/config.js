const { Command } = require( 'commander' );
const config = require( './default.js' );
const pack = require( '../package.json' );

const program = new Command();

function setProgramOptions( program, config ) {

    let option, defaultValue;

    Object.keys( config ).forEach( key => {

        option = config[ key ];

        switch ( option.type ) {

        case 'number':

            defaultValue = parseInt( option.default );
            if ( isNaN( defaultValue ) ) {

                throw new Error( 'option ${key} should be a number' );

            }
            break;

        case 'port':

            defaultValue = parseInt( option.default );
            
            if ( 
                isNaN( defaultValue ) || 
                defaultValue < 1024 || 
                defaultValue > 65535 
            ) {

                throw new Error( 'option ${key} should be a number between 1000 and 65535 '+defaultValue );

            }
            break;

        case 'boolean':

            if ( option.default.match( /true/i ) ) {

                defaultValue = true;

            } else if ( option.default.match( /false/i ) ) {

                defaultValue = false;

            } else {

                throw new Error( 'option ${key} should be a boolean (true or false)' );

            }
            break;
        
        case 'regexp':
            
            defaultValue = new RegExp( option.default );
            break;

        default:

            defaultValue = option.default.toString();

        }

        program.option( option.opt, option.help, defaultValue );

    } );

}



program
    .name( pack.name )
    .description( pack.description )
    .version( pack.version );

setProgramOptions( program, config );

program.parse( process.argv );


module.exports = program.opts();