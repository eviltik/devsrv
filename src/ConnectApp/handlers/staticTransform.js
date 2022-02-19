const injector = require( 'connect-injector' );
const log = require( '../../logger.js' );   

function compileRegexp( str ) {

    str = str.replace( /\\\\/, '\\', str );

    try {

        str = new RegExp( str, 'ig' );

    } catch( e ) {

        throw new Error( `${e.message}` );

    }

    log.debug( 'compileRegexp', str );

    return str;

}

function addHandler( app, config ) {

    const logPrefix = 'staticTransform: ';

    if ( !config.textReplacements || !config.textReplacements.length ) {

        return;

    }

    config.textReplacements.forEach( configTextReplacement => {

        let v =  configTextReplacement.value || configTextReplacement.defaultValue;
        configTextReplacement.pathRegexp = compileRegexp( configTextReplacement.pathRegexp );
        configTextReplacement.replaceRegexp = compileRegexp( configTextReplacement.replaceRegexp );

        if ( configTextReplacement.queryVarRegexp ) {

            configTextReplacement.queryVarRegexp = compileRegexp( configTextReplacement.queryVarRegexp );

        }

        log.debug( `${logPrefix}data`, configTextReplacement.replaceRegexp, '=>', v );

        const middleware = injector( function( req ) {

            return req._parsedUrl.pathname.match( configTextReplacement.pathRegexp );

        }, function( content, req, res, callback ) {

            const qs = new URLSearchParams( req._parsedUrl.query );
            const varValue = qs.get( configTextReplacement.queryVar );

            if ( varValue ) {

                if ( configTextReplacement.queryVarRegexp ) {

                    if ( varValue.match( configTextReplacement.queryVarRegexp ) ) {

                        // change the value with the one found in the query string
                        v = varValue;

                    } else {

                        // stay with default value

                    }

                }

            }

            log.debug( `replacing ${configTextReplacement.replaceRegexp} with ${v} ` );

            content = content.toString().replace( configTextReplacement.replaceRegexp, v );

            // reset to default

            v = configTextReplacement.value || configTextReplacement.defaultValue;

            callback( null, content );

        } );

        // understandable debug logs
        Object.defineProperty( middleware, 'name', { value: 'staticTransform' } );

        app.use( middleware ) ;

    } );

}

module.exports = {
    addHandler
};
