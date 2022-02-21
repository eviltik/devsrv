
const logger = {};

let d = new Date();

function prefix( level, args ) {

    args = [...args];

    args.unshift( `devsrv - ${level}:` );

    // add date;
    d = new Date();
    args.unshift( d.toGMTString() );
    return args;

}

logger.info = function info() {

    console.log.apply( console, prefix( 'info', arguments ) );

};

logger.error = function error() {

    console.log.apply( console, prefix( 'error', arguments ) );

};

logger.warn = function warn() {

    console.log.apply( console, prefix( 'warn', arguments ) );

};

if ( process.env.DEBUG ) {

    logger.debug = function() {

        console.log.apply( console, prefix( 'debug', arguments ) );

    };

} else {

    logger.debug = () => {};

}


module.exports = logger;
