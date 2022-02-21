const pem = require( 'pem' );
const fs = require( 'fs-extra' );
const log = require( './logger.js' );
const utils = require ( './utils.js' );
const path = require( 'path' );

// we are the server, we don't need this
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


function generateSSLCertificates( callback ) {

    log.debug( 'ssl: generateSSLCertificates: generating new self signed SSL Certificates ...' );

    const pemOptions = { 
        days: 365, 
        selfSigned: true 
    };

    pem.createCertificate( pemOptions, ( err, keys ) => {
        
        if ( err ) throw err;

        const opts = {};
        opts.key = keys.serviceKey;
        opts.cert = keys.certificate;
        callback( null, opts );

    } );

}

function readCertificates( options, callback ) {

    const homePath = utils.getHome();
    const fileKey = path.join( homePath, 'certs', 'server.key' );
    const fileCrt = path.join( homePath, 'certs', 'server.crt' );
    //const fileCa = path.join( homePath, 'certs', 'ca.crt' );

    try {

        log.debug( `readCertificates: reading self signed private key ${fileKey}` );
        log.debug( `readCertificates: reading self signed certificate ${fileCrt}` );

        options.key = fs.readFileSync( fileKey );
        options.cert = fs.readFileSync( fileCrt );
        //options.ca = fs.readFileSync( fileCa );

    } catch( e ) {

        // file can not be read or does not exists

    }

    
    if ( !options.key || !options.cert ) {

        fs.ensureDirSync( path.join( homePath, 'certs' ) );

        generateSSLCertificates( ( err, opts ) => {

            log.debug( `ssl: readCertificates: writing self signed private key ${fileKey}` );
            log.debug( `ssl: readCertificates: writing self signed certificate ${fileCrt}` );

            fs.writeFileSync( fileKey, opts.key.toString() );
            fs.writeFileSync( fileCrt, opts.cert.toString() );
            options.key = opts.key;
            options.cert = opts.cert;
            callback && callback();

        } );

    } else {

        log.debug( `ssl: readCertificates: using self signed private key ${fileKey}` );
        log.debug( `ssl: readCertificates: using self signed certificate ${fileCrt}` );

        callback && callback();

    }
            

}

module.exports = {
    readCertificates
};
