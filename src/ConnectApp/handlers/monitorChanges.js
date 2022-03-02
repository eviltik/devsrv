const assert = require( 'assert' );
const deepmerge = require( 'deepmerge' );
const path = require( 'path' );
const fs = require( 'fs-extra' );

const DEFAULT_OPTIONS = {

    enable:true,
    directories:[],
    excludeRegexp: /node_modules/,
    fileRegexp:/\.(html|jsm?)$/

};


const log = require( '../../logger.js' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    if ( !config.monitorOptions )
        config.monitorOptions = DEFAULT_OPTIONS;
    else
        config.monitorOptions = deepmerge( DEFAULT_OPTIONS, config.monitorOptions , { } );

    if ( typeof config.monitorOptions.fileRegexp === 'string' )
        config.monitorOptions.fileRegexp = new RegExp( config.monitorOptions.fileRegexp );

    if ( typeof config.monitorOptions.excludeRegexp === 'string' )
        config.monitorOptions.excludeRegexp = new RegExp( config.monitorOptions.excludeRegexp );

    // command line option check
    if ( !config.monitorChanges )
        if ( !config.monitorOptions.enable )
            return;

    if ( !config.monitorOptions.directories || !config.monitorOptions.directories.length )
        throw new Error( 'monitorChanges: monitorOptions.directories should contain an array of path' );


    config.monitorOptions.directories.forEach( dir => {
        
        dir = path.resolve( dir );

        if ( !fs.pathExistsSync( dir ) )
            throw new Error( `monitorChanges: directory ${dir} does not exists` );

        log.info( `monitorChanges: monitor changes for directory ${dir} ` );

        fs.watch( dir, { recursive:true }, onChange );


    } );
    
    let clients = [];
    let timer;

    function onChange( event, filename ) {

        if ( !filename )
            return;

        if ( config.monitorOptions.fileRegexp ) 
            if( !filename.match( config.monitorOptions.fileRegexp ) ) {

                log.debug( `monitorChanges: ignore event ${event} for file ${filename}` );
                return;

            }

        if ( config.monitorOptions.excludeRegexp ) 
            if( filename.match( config.monitorOptions.excludeRegexp ) ) {

                log.debug( `monitorChanges: exclude event ${event} for file ${filename}` );
                return;

            }


        if ( timer )
            clearTimeout( timer );


        timer = setTimeout( () => {

            log.info( `monitorChanges: event ${event} for file ${filename}` );
            broadcast( 'reload' );

        }, 500 );

    }

    function broadcast( event, data = '' ) {
        
        log.info( `monitorChanges: sending ${event} to clients` );

        clients.forEach( client => {

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

        log.debug( `adding client ${newClient.id}` );
      
        clients.push( newClient );
      
        req.on( 'close', () => {

            log.debug( `${clientId} Connection closed` );
            clients = clients.filter( client => client.id !== clientId );

        } );

    }
      
    app.use( ( req, res, next ) => {

        if ( req.url === '/devsrv' && req.method === 'GET' )
            eventsHandler( req, res );
        else
            next();
        
    } );

}

module.exports = {
    addHandler
};
