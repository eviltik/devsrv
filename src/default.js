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
        opt:'-i, --interface <regexpInterface>',
        help:'Network interface filter (regular expression)',
        default:'/wi-fi|eth0/i',
        type:'regexp'
    },

    browser:{
        opt:'-b, --browser',
        help:'Open the browser',
        default:'true',
        type:'boolean'
    }


};



