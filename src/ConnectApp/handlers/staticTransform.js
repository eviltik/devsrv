const assert = require( 'assert' );
const injector = require( 'connect-injector' );

const log = require( '../../logger.js' );   
const utils = require( '../../utils.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    const logPrefix = 'staticTransform: ';

    initTextReplacements();

    function initTextReplacements() {

        if ( !config.textReplacements || !config.textReplacements.length )
            return;

        config.textReplacements.forEach( ctr => {

            // precompile regexp
            ctr.pathRegexp = utils.compileRegexp( ctr.pathRegexp );
            ctr.replaceRegexp = utils.compileRegexp( ctr.replaceRegexp );
            ctr.queryVarRegexp = utils.compileRegexp( ctr.queryVarRegexp );
    
            const middleware = injector(
                req => {
    
                    return shouldInject( ctr, req );
    
                },
                ( content, req, res, callback ) => {
    
                    injectVars( ctr, content, req, res, callback );
    
                }
            );
    
            // understandable debug logs
            Object.defineProperty(
                middleware,
                'name',
                { value: 'staticTransform' }
            );
    
            // make connect app use this middleware
            app.use( middleware ) ;
    
        } );
        
    }

    function shouldInject( ctr, req ) {

        log.debug( `staticTransform: shouldInject: ${req.url} ?` );

        const url = req._parsedUrl.pathname;
        const result = url.match( ctr.pathRegexp );

        if ( result ) 
            log.debug( `staticTransform: shouldInject: ${req.url} true` );
        else
            log.debug( `staticTransform: shouldInject: ${req.url} false` );
        
        return result;

    }
    
    function injectVars( ctr, content, req, res, callback ) {

        // look for query var
        const qs = new URLSearchParams( req._parsedUrl.query );
        const queryStringVarValue = qs.get( ctr.queryVar );
        
        // TODO: i don't remember why i did that, there is only defaultValue currently
        let finalValue =  ctr.value || ctr.defaultValue;

        // change the value with the one found in the query string 
        if ( queryStringVarValue && ctr.queryVarRegexp && queryStringVarValue.match( ctr.queryVarRegexp ) )
            finalValue = queryStringVarValue;

        // replace content
        content = content.toString().replace( ctr.replaceRegexp, finalValue );
        log.debug( `${logPrefix}`, ctr.replaceRegexp, '=>', finalValue );

        // reset to original value
        finalValue = ctr.value || ctr.defaultValue;

        callback( null, content );

    }

}

module.exports = {
    addHandler
};
