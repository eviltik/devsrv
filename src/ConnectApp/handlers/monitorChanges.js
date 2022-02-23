const assert = require( 'assert' );
const path = require( 'path' );
const fs = require( 'fs-extra' );

const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    if ( !config.documentRoot )
        throw new Error( 'monitorChanges: documentRoot is mandatory' );

    config.documentRoot = path.resolve( config.documentRoot );
    if ( !fs.pathExistsSync( config.documentRoot ) )
        throw new Error( `monitorChanges: documentRoot ${config.documentRoot} does not exists` );

    log.info( `monitorChanges: monitor changes for ${config.documentRoot} ` );

    fs.watch( config.documentRoot, { recursive:true }, onChange );

    let clients = [];
    let timer;

    function onChange() {

        // event, filename

        clearTimeout( timer );

        timer = setTimeout( () => {

            broadcast( 'reload' );

        }, 100 );

    }

    function broadcast( event, data = '' ) {

        clients.forEach( client => {

            log.info( `sending ${event} to ${client.id}` );
            client.response.write( `event: ${event}\n` );
            client.response.write( `data: ${data}\n` );
            client.response.write( '\n\n' );

        } );

    }

    function eventsHandler( req, res ) {

        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        res.writeHead( 200, headers );
      
        /*
        const data = `data: ${JSON.stringify( facts )}\n\n`;      
        res.write( data );
        */
       
        const clientId = Date.now();
      
        const newClient = {
            id: clientId,
            response:res
        };

        log.info( `adding client ${newClient.id}` );
      
        clients.push( newClient );
      
        req.on( 'close', () => {

            console.log( `${clientId} Connection closed` );
            clients = clients.filter( client => client.id !== clientId );

        } );

    }
      
    app.use( ( req, res, next ) => {

        console.log( req.method, req.url );

        if ( req.url === '/devsrv' && req.method === 'GET' )
            eventsHandler( req, res );
        else
            next();
        
    } );

}

module.exports = {
    addHandler
};
