const assert = require( 'assert' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const serveIndex = require( 'serve-index' );

const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    if ( !config.explorer )
        return;

    if ( !config.documentRoot )
        throw new Error( 'explorer: documentRoot is mandatory' );

    config.documentRoot = path.resolve( config.documentRoot );
    if ( !fs.pathExistsSync( config.documentRoot ) )
        throw new Error( `explorer: documentRoot ${config.documentRoot} does not exists` );

    log.warn( `explorer: enable directory listing, documentRoot is ${config.documentRoot}` );

    const serve = serveIndex(
        config.documentRoot,
        {
            icons:true
        }
    );

    app.use( serve );

}

module.exports = {
    addHandler
};
