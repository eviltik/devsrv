const assert = require( 'assert' );
const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );
    
    if ( !config.clientRedirects || !config.clientRedirects.length ) 
        return;
    
    log.debug( `clientRedirects: addHandler: adding ${config.clientRedirects.length} redirect(s)` );

    function testRedirect( req, res, next ) {

        let foundRedirect = null;

        config.clientRedirects.forEach( redirect => {
            
            if ( !foundRedirect )
                if ( req._parsedUrl.path.toString() === redirect.urlSrc.toString() )
                    foundRedirect = redirect;

        } );

        if ( !foundRedirect ) {

            next();

        } else {

            log.debug( `clientRedirect: sending redirect ${foundRedirect.urlSrc} => ${foundRedirect.redirectTo}` );
            res.writeHead( 302, { location: foundRedirect.redirectTo } );
            res.end();
            
        }

    }

    app.use( testRedirect );

}

module.exports = {
    addHandler
};
