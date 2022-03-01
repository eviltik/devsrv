const assert = require( 'assert' );
const path = require( 'path' );
const log = require( './logger.js' );
const fs = require( 'fs-extra' );
const networkInterfaces = require( 'os' ).networkInterfaces;

function getPackageName() {

    const packageJsonFile = path.resolve( __dirname,'..', 'package.json' );
    return fs.readJsonSync( packageJsonFile ).name;

}

function getHome() {
    
    let home = process.env.APPDATA || ( process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share' );
    home = path.join( home, getPackageName() );
    log.debug( `util: getHome: using path ${home}` );
    fs.ensureDirSync( home );

    return home;

}

function getIpAddress( interfaceRegexp ) {

    log.debug( 'utils: getIpAddress', interfaceRegexp );

    const nets = networkInterfaces();
    const keys = Object.keys( nets );
    let ip, name, net;

    for ( name of keys ) {

        for ( net of nets[ name]  ) {

            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if ( 
                net.family === 'IPv4' && 
                !net.internal && 
                name.match( interfaceRegexp )
            ) {

                ip = net.address;

            }

        }

    }

    if ( !ip ) {

        throw new Error( 'Could not fetch Wi-Fi IP Address' );

    }

    return ip;

}

function compileRegexp( str , flags ) {

    if ( str instanceof RegExp ) {

        // already a regexp
        return str;
        
    }

    assert( typeof str === 'string', 'str should be a string' );
    
    if ( !flags )
        flags = 'ig';

    // TODO: devsrv.js rather than devsrv.config.json so we can use native regexp to avoid this security issue
    // SECURITY: don't reuse this code if you are not sure the value is coming from a trusted source

    str = str.replace( /\\\\/, '\\', str );
    

    try {

        str = new RegExp( str, flags );

    } catch( e ) {

        throw new Error( `${e.message}` );

    }

    log.debug( 'compileRegexp', str );

    return str;

}

module.exports = {
    getPackageName,
    getHome,
    getIpAddress,
    compileRegexp,
};
