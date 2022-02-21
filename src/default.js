module.exports = {

    documentRoot:{
        opt:'-d, --document-root <documentRoot>',
        help:'DocumentRoot',
        default:'./',
        type:'string'
    },

    listeningPort:{
        opt:'-l, --listening-port <listeningPort>',
        help:'Listening port',
        default:'8443',
        type:'port'
    },

    interface:{
        opt:'-i, --interface <interfaceRegexp>',
        help:'Network interface filter (regular expression)',
        default:'/wi-fi|eth0/i',
        type:'regexp'
    },

    openBrowser:{
        opt:'-o, --openBrowser',
        help:'Open the browser',
        default:'false',
        type:'boolean'
    },

    configFile:{
        opt:'-c, --config-file <configFile>',
        help:'Configuration file',
        default:'./.devsrv.json',
        type:'string'
    }


};



