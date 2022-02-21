const assert = require( 'assert' );
const log = require( '../../logger.js' );

function addHandler( app, config ) {
    
    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );
    
    if ( !config.clientRedirects || !config.clientRedirects.length ) 
        return;
    
    log.debug( `clientRedirects: addHandler: adding ${config.clientRedirects.length} redirect(s)` );

    app.use( function redirect( req, res, next ) {

        let foundRedirect = false;

        config.clientRedirects.forEach( redirect => {
            
            if ( foundRedirect )
                return;

            if ( req._parsedUrl.path !== redirect.urlSrc ) 
                return;

            foundRedirect = true;
            res.writeHead( 302, { location: redirect.redirectTo } );
            res.end();
            return;

        } );

        if ( !foundRedirect )
            next();

    } );

}

module.exports = {
    addHandler
};
