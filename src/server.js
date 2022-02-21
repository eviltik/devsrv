const openBrowser = require( 'open' );

const log = require( './logger.js' );
const ssl = require( './ssl.js' );
const ConnectApp = require( './ConnectApp/index.js' );
const configHelper = require( './config.js' );

const protocols = {
    https:require( 'https' ),
    http:require( 'http' )
};

const OPTIONS = require( './options.js' );


function Server ( config = {} ) {

    config = configHelper.prepare( OPTIONS, config );

    const app = new ConnectApp( config );
    const serverOptions = {
        port : config.listeningPort
    };
            
    let protocol = protocols.https;
    let url;

    initCodeSandbox();


    function initCodeSandbox() {

        if ( !process.env.CODESANDBOX_SSE )
            return;

        log.info( 'server: codesandbox container detected' );
        config.listeningIpAddr = '127.0.0.1';
        protocol = protocols.http;

    }

    function getUrl() {

        if ( url ) 
            // url already built
            return url;
        
        // add protocol
        url = 'https://';
        if ( protocol === protocols.http )
            url = 'http://';

        // add listening ip addr
        url += config.listeningIpAddr;
    
        // add port is non standard
        if ( config.listeningPort != 443 && config.listeningPort != 80 )
            url+=`:${serverOptions.port}`;

        // add trailing slash
        url += '/';

        return url;
            
    }

    function serverStart( callback ) {
          
        log.info( `server: start listening on ${getUrl()}` );

        const server = protocol
            .createServer( serverOptions, app )
            .listen( serverOptions.port, config.listeningIpAddr );

        log.info( 'server: ready' );

        callback && callback( null, server );

    }

    function testOpenBrowser() {

        if ( !config.openBrowser )
            return;

        const url = getUrl();
        log.info( `server: opening default web browser on ${url}` );
        openBrowser( `${url}` );

    }

    function start( callback ) {
        
        ssl.readCertificates( serverOptions, () => {
            
            serverStart( err => {

                if ( err ) 
                    throw err;

                testOpenBrowser();
                callback && callback( err );

            } );

        } );

    }

    return {
        start
    };

}

module.exports = Server;

