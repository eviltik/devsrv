
const log = require( '../../logger.js' );

function addHandler( app, config ) {

    if ( !config.clientRedirects || !config.clientRedirects.length ) 
        return;
    
    log.debug( `clientRedirects: addHandler: adding ${config.clientRedirects.length} redirect(s)` );

    app.use( function redirect( req, res, next ) {

        let foundRedirect = false;

        config.clientRedirects.forEach( redirect => {
            
            if ( req._parsedUrl.path === redirect.urlSrc ) {

                foundRedirect = true;
                res.writeHead( 302, { location: redirect.redirectTo } );
                res.end();
                return;

            }

        } );

        if ( !foundRedirect ) {
            
            next();

        }

    } );

}

module.exports = {
    addHandler
};
