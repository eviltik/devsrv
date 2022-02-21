const assert = require( 'assert' );
const log = require( '../../logger.js' );   
const utils = require( '../../utils.js' );   

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    const logPrefix = 'urlRewrites: ';
    const compiledRegexps = { };
    let compiledRe, originalUrl, pathMatch = null;

    initRewrites();

    function initRewrites() {

        if ( !config.urlRewrites || !config.urlRewrites.length ) 
            return;

        log.debug( `${logPrefix}adding ${config.urlRewrites.length} URL rewrite(s)` );

        app.use( rewritesHandler );

    }
       
    function rewritesHandler( req, res, next ) {

        pathMatch = null;

        config.urlRewrites.forEach( rewrite => {
            
            if ( pathMatch ) return;

            compiledRe = compiledRegexps[ rewrite.urlSrcRegexp ];

            if ( !compiledRe )
                compiledRe = compiledRegexps[ rewrite.urlSrcRegexp ] = utils.compileRegexp( rewrite.urlSrcRegexp, 'ig' );
            
            if ( compiledRe && req._parsedUrl.path.match( compiledRe ) ) {
                
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

    }

}

module.exports = {
    addHandler
};
