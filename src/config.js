
const deepmerge = require( 'deepmerge' );
const path = require( 'path' );
const fs = require( 'fs-extra' );

const log = require( './logger.js' );
const utils = require ( './utils.js' );

function parseNumber( key, value ) {

    const v = parseInt( value );

    if ( isNaN( v ) ) {
        
        throw new Error( `option ${key} should be a number` );

    }

    return v;

}

function parsePort( key, value ) {

    const v = parseInt( value );
            
    if ( isNaN( v ) ||  v < 1024 || v > 65535 ) {

        throw new Error( `option ${key} should be a number between 1000 and 65535 ` );

    }

    return v;

}

function parseBoolean( key, value ) {
    
    let v;

    if ( value.match( /true/i ) ) {

        v = true;

    } else if ( value.match( /false/i ) ) {

        v = false;

    } else {

        throw new Error( `option ${key} should be a boolean (true or false)` );

    }

    return v;

}

function parseRegexp( key, value ) {

    let v;
    
    try {

        v = new RegExp( value );
    
    } catch( err ) {

        throw new Error( `option ${key} is not a valid regular expression\n${err.message}` );
    
    }
    
    return v;

}

function clean( config ) {
    
    let option, value;

    Object.keys( config ).forEach( key => {

        option = config[ key ];

        switch ( option.type ) {

        case 'number':  value = parseNumber( key, option.default ); break;
        case 'port':    value = parsePort( key, option.default ); break;
        case 'boolean': value = parseBoolean( key, option.default ); break;
        case 'regexp':  value = parseRegexp( key, option.default ); break;
        default:        value = option.default.toString();

        }

        config[key].value = value;

    } );

}

function mergeWithConfigFile( config ) {

    if ( !config.configFile ) return;

    let configFromFile;

    if ( !fs.pathExistsSync( config.configFile ) ) {

        log.error( `error: config file ${config.configFile} not found` );
        process.exit( -1 );

    }

    try {
        
        configFromFile = fs.readJsonSync( config.configFile );

    } catch( err ) {
        
        if ( err.message.match( /file/ ) ) {
            // ignore
        } else if ( err.message.match( / JSON / ) ) {
            
            throw err;

        }

    }

    if ( configFromFile ) {

        config = deepmerge( configFromFile, config );
        log.info( `config: merging config with ${config.configFile}` );
        return config;

    }

    return config;

}

function prepare( defaultConfig, config ) {


    config = deepmerge( defaultConfig, config );

    if ( config.configFile ) {

        config.configFile = path.resolve( config.configFile );
        config = mergeWithConfigFile( config );
    
    }

    config.interfaceRegexp = new RegExp( config.interfaceRegexp, 'i' );
    config.listeningIpAddr = utils.getIpAddress( config.interfaceRegexp );

    return config;

}



module.exports = {
    clean,
    prepare
};
