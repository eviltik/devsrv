const https = require( 'https' );

const connect = require( 'connect' );
const serveStatic = require( 'serve-static' );
const networkInterfaces = require( 'os' ).networkInterfaces;

const pem = require( 'pem' );
const path = require( 'path' );
const fs = require( 'fs-extra' );
const open = require( 'open' );

const log = require( './logger.js' );
const utils = require ( './utils.js' );

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function Server ( config ) {

    if ( !config ) {

        config = require( './config.js' );

    }

    function getIpAddress( ) {

        const nets = networkInterfaces();
        const keys = Object.keys( nets );
        let ip, name, net;


        for ( name of keys ) {

            for ( net of nets[ name]  ) {

                // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
                if ( 
                    net.family === 'IPv4' && 
                    !net.internal && 
                    name.match( config.regexpInterface )
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


    function generateSSLCertificates( callback ) {

        log.info( 'server: generateSSLCertificates: generating new self signed SSL Certificates ...' );

        pem.createCertificate( { days: 365, selfSigned: true }, ( err, keys ) => {
            
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

            //log.info( `readCertificates: reading self signed private key ${fileKey}` );
            //log.info( `readCertificates: reading self signed certificate ${fileCrt}` );

            options.key = fs.readFileSync( fileKey );
            options.cert = fs.readFileSync( fileCrt );
            //options.ca = fs.readFileSync( fileCa );

        } catch( e ) {
            // file can not be read or does not exists
        }

        
        if ( !options.key || !options.cert ) {

            fs.ensureDirSync( path.join( homePath, 'certs' ) );

            generateSSLCertificates( ( err, opts ) => {

                log.info( `server: readCertificates: writing self signed private key ${fileKey}` );
                log.info( `server: readCertificates: writing self signed certificate ${fileCrt}` );

                fs.writeFileSync( fileKey, opts.key.toString() );
                fs.writeFileSync( fileCrt, opts.cert.toString() );
                options.key = opts.key;
                options.cert = opts.cert;
                callback();

            } );

        } else {

            log.info( `server: readCertificates: using self signed private key ${fileKey}` );
            log.info( `server: readCertificates: using self signed certificate ${fileCrt}` );

            callback();

        }
                

    }

    function start( callback ) {
        
        const serverOptions = {};
        const app = connect();

        // serve static files in document root
        const documentRoot = path.resolve( config.documentRoot );
        log.info( `server: start: using documentRoot ${documentRoot} ` );

        const serve = serveStatic(
            documentRoot,
            {
                index: [
                    'index.html',
                    'index.htm'
                ]
            }
        );

        app.use( serve );
        
        function serverStart() {
            
            const ip = getIpAddress( config );
            log.info( `server: starting on ${ip}:${config.listeningPort}` );

            serverOptions.port = config.listeningPort;

            const server = https
                .createServer( serverOptions, app )
                .listen( serverOptions.port, ip );

            const url = `https://${ip}:${serverOptions.port}`;

            log.info( 'server: ready' );

            if ( config.browser ) {

                log.info( `server: opening default web browser on ${url}` );
                open( `${url}` );

            }

            callback && callback( null, server );

        }

        readCertificates( serverOptions, serverStart );

    }


    return {

        start

    };


}

module.exports = Server;

