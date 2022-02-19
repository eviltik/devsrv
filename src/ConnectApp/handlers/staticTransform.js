const injector = require( 'connect-injector' );
const log = require( '../../logger.js' );   

function compileRegexp( str ) {

    str = str.replace( /\\\\/, '\\', str );
    str = new RegExp( str, 'ig' );

    return str;

}

function addHandler( app, config ) {

    const logPrefix = 'staticTransform: ';

    if ( !config.textReplacements || !config.textReplacements.length ) {

        return;

    }
    
    config.textReplacements.forEach( data => {

        const v =  data.value || data.defaultValue;
        data.pathRegexp = compileRegexp( data.pathRegexp );
        data.replaceRegexp = compileRegexp( data.replaceRegexp );

        log.debug( `${logPrefix}data`, data.replaceRegexp, '=>', v );

        const middleware = injector( function staticTransform( req ) {

            return req._parsedUrl.pathname.match( data.pathRegexp );

        }, function converter( content, req, res, callback ) {

            content = content.toString().replace( data.replaceRegexp, v );

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
