const assert = require( 'assert' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const serveStatic = require( 'serve-static' );

const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    if ( !config.documentRoot )
        throw new Error( 'documentRoot is mandatory' );

    config.documentRoot = path.resolve( config.documentRoot );
    if ( !fs.pathExistsSync( config.documentRoot ) )
        throw new Error( `staticServer: addHandler: documentRoot ${config.documentRoot} does not exists` );

    log.debug( `staticServer: addHandler: static file will be served from ${config.documentRoot} ` );

    const serve = serveStatic(
        config.documentRoot,
        {
            index: [
                'index.html',
                'index.htm'
            ]
        }
    );

    app.use( serve );

}

module.exports = {
    addHandler
};
