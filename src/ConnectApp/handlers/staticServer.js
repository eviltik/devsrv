
const path = require( 'path' );
const fs = require( 'fs-extra' );
const serveStatic = require( 'serve-static' );

const log = require( '../../logger.js' );

function addHandler( app, config ) {

    const documentRoot = path.resolve( config.documentRoot );

    if ( !fs.pathExistsSync( config.documentRoot ) ) {

        throw new Error( `staticServer: addHandler: documentRoot ${config.documentRoot} does not exists` );

    }

    log.debug( `staticServer: addHandler: static file will be served from ${documentRoot} ` );

    const serve = serveStatic(
        documentRoot,
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
