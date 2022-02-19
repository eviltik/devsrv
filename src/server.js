const https = require( 'https' );

const open = require( 'open' );

const log = require( './logger.js' );
const ssl = require( './ssl.js' );
const ConnectApp = require( './ConnectApp/index.js' );
const configHelper = require( './config.js' );

const OPTIONS = require( './options.js' );


function Server ( config = {} ) {

    config = configHelper.prepare( OPTIONS, config );

    const app = new ConnectApp( config );
    const serverOptions = {};
    
    function serverStart( config, callback ) {
            
        log.info( `server: start listening on ${config.listeningIpAddr}:${config.listeningPort}` );

        serverOptions.port = config.listeningPort;

        const server = https
            .createServer( serverOptions, app )
            .listen( serverOptions.port, config.listeningIpAddr );


        log.info( 'server: ready' );

        callback && callback( null, server );

    }

    function openBrowser( config ) {

        if ( config.browser ) {

            const url = `https://${config.listeningIpAddr}:${serverOptions.port}`;
            log.info( `server: opening default web browser on ${url}` );
            open( `${url}` );

        }

    }

    function start( callback ) {
        

        ssl.readCertificates( serverOptions, () => {
            
            serverStart( config, ( err ) => {

                openBrowser( config );
                callback && callback( err );

            } );

        } );

    }


    return {

        start

    };


}

module.exports = Server;

