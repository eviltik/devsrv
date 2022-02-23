const assert = require( 'assert' );
const path = require( 'path' );
const fs = require( 'fs-extra' );

const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    if ( !config.accessLog )
        return;

    app.use( ( req, res, next ) => {

        log.info( req.method, req.url );
        next();
        
    } );

}

module.exports = {
    addHandler
};

