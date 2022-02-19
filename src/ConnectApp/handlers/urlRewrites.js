const log = require( '../../logger.js' );   

function addHandler( app, config ) {
    
    const logPrefix = 'urlRewrites: ';

    if ( !config.urlRewrites || !config.urlRewrites.length ) 
        return;
    
    log.debug( `${logPrefix}adding ${config.urlRewrites.length} URL rewrite(s)` );

    const expressions = { };

    let compiledRe, originalUrl, pathMatch = null;

    app.use( function rewrite( req, res, next ) {

        pathMatch = null;

        config.urlRewrites.forEach( rewrite => {
            
            if ( pathMatch ) {
            
                log.info( 'aborting, pathMatch already set', pathMatch );
                return;

            }

            compiledRe = expressions[ rewrite.urlSrcRegexp ];

            if ( !compiledRe ) {
                
                try {

                    compiledRe = expressions[ rewrite.urlSrcRegexp ] = new RegExp( rewrite.urlSrcRegexp, 'ig' );
                    //log.debug( 'regexp has been compiled', compiledRe );

                } catch( err ) {

                    throw new Error( `${logPrefix}could not convert string to regexp\n${err.message}` );

                }

            } 
            
            if ( req._parsedUrl.path.match( compiledRe ) ) {
                
                log.debug( 'url match', req._parsedUrl.path, compiledRe );
                pathMatch = rewrite;

            }

        } );
        
        if ( compiledRe && pathMatch ) {
                
            originalUrl = req.url.toString();

            req.url = req.url.replace( compiledRe, pathMatch.replaceWith );

            log.debug( `${logPrefix}path ${originalUrl} rewritten to ${req.url}` );
            
        }

        next();

    } );

}

module.exports = {
    addHandler
};
