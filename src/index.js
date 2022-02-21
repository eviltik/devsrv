const configHelper = require( './config.js' );
const server = require( './server.js' );
const program = require( './program.js' );

function DevServer( config = {} ) {

    config = configHelper.prepare( program.opts, config );

    return new server( config );

}

module.exports = DevServer;

