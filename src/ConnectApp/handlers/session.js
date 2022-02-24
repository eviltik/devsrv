const assert = require( 'assert' );
const cookieSession = require( 'cookie-session' );

function addHandler( app, config ) {

    assert( typeof app === 'function', 'app should be a function' );
    assert( typeof config == 'object', 'config should be an object' );

    app.use( cookieSession( {
        keys: ['devsrv', 'notimportant']
    } ) );

}

module.exports = {
    addHandler
};

