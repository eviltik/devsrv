const configHelper = require( './config.js' );
const server = require( './server.js' );
const program = require( './program.js' );
const builder = require( './builder.js' );

builder.checkForBuild( program );

function DevServer( config = {} ) {

    config = configHelper.prepare( program.opts, config );
    return new server( config );

}

module.exports = DevServer;

