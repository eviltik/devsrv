const path = require( 'path' );
const fs = require( 'fs-extra' );

const configHelper = require( './config.js' );
const log = require( './logger.js' );
const utils = require( './utils.js' );

function getAllFiles( dirPath, arrayOfFiles ) {

    const files = fs.readdirSync( dirPath );
  
    arrayOfFiles = arrayOfFiles || [];
  
    files.forEach( file => {

        if ( fs.statSync( dirPath + '/' + file ).isDirectory() )
            arrayOfFiles = getAllFiles( dirPath + '/' + file, arrayOfFiles );
        else
            arrayOfFiles.push( path.join( dirPath, '/', file ) );

    } );
  
    return arrayOfFiles;

}

function builder() {

    let config;

    function build() {

        let dst = path.resolve( config.buildOptions.dst );
        let src = path.resolve( config.buildOptions.src );

        dst = path.resolve( dst );
        src = path.resolve( src );

        if ( !fs.pathExistsSync( src ) )
            throw new Error( `build source directory does not exist (${src})` );

        if ( fs.pathExistsSync( dst ) ) {

            log.debug( `builder: removing ${dst}` );
            fs.rmSync( dst, { recursive: true } );
        
        }

        log.debug( `builder: copying ${src} into ${dst}` );
        fs.copySync( src, dst );

        config.buildOptions.fileRegexp = utils.compileRegexp( config.buildOptions.fileRegexp );
        config.buildOptions.replaceRegexp = utils.compileRegexp( config.buildOptions.replaceRegexp, 'g' );

        const files = getAllFiles( dst );
        files.forEach( replaceFileContent );

        log.info( 'build success' );
        process.exit();

    }

    function replaceFileContent( file ) {

        if ( !config.buildOptions.fileRegexp )
            return;

        if ( !file.match( config.buildOptions.fileRegexp ) )
            return;
        
        file = path.resolve( file );
        log.debug( 'replaceFileContent', file );
        
        let content = fs.readFileSync( file );
        content = content.toString().replace( config.buildOptions.replaceRegexp, config.buildOptions.defaultValue );
        fs.writeFileSync( file, content );

    }

    function checkForBuild( program ) {

        config = configHelper.prepare( program.opts );
        
        if ( !config.build )
            return;

        if ( program.buildSrc && !program.buildDst )
            throw new Error( 'missing build dst' );
        
        if ( program.buildDst && !program.buildSrc )
            throw new Error( 'missing build src' );

        build();

    }

    return {
        build,
        checkForBuild
    };

}

module.exports = new builder;
