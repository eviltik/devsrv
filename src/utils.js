const path = require( 'path' );
const log = require( './logger.js' );
const fs = require( 'fs-extra' );

function getPackageName() {

    const packageJsonFile = path.resolve( __dirname,'..', 'package.json' );
    log.debug( `util: getPackageName: reading ${packageJsonFile}` );

    return fs.readJsonSync( packageJsonFile ).name;

}

function getHome() {
    
    let home = process.env.APPDATA || ( process.platform == 'darwin' ? process.env.HOME + '/Library/Preferences' : process.env.HOME + '/.local/share' );
    home = path.join( home, getPackageName() );
    log.info( `util: getHome: using path ${home}` );
    fs.ensureDirSync( home );

    return home;

}

module.exports = {
    getPackageName,
    getHome
};
