const connect = require( 'connect' );
const handlers = require( './handlers/index.js' );

function prepareConfig( app, config ) {

    // session handler
    handlers.session.addHandler( app, config );

    // access logger
    handlers.accessLog.addHandler( app, config );

    // monitor file changes
    handlers.monitorChanges.addHandler( app, config );

    // deliver static files with text replacement
    handlers.staticTransform.addHandler( app, config );

    // handler client redirects
    handlers.clientRedirects.addHandler( app, config );

    // perhaps rewrite paths ?
    handlers.urlRewrites.addHandler( app, config );

    // deliver static files with text replacement
    handlers.staticServer.addHandler( app, config );

    // directory listing
    handlers.explorer.addHandler( app, config );
    
    return app;

}

function ConnectApp( config ) {

    const app = connect();
    prepareConfig( app, config );
    return app;

}

module.exports = ConnectApp;
