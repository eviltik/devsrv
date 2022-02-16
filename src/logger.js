const logger = {};

logger.info = function() {

    console.log.apply( console, arguments );

};

logger.error = function() {

    console.log.apply( console, arguments );

};

logger.warn = function() {

    console.log.apply( console, arguments );

};

if ( process.env.DEBUG ) {

    logger.debug = function() {

        console.log.apply( console, arguments );

    };

} else {

    logger.debug = () => {};

}


module.exports = logger;
