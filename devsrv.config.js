const config = {
    documentRoot: './tests',
    interfaceRegexp: /wi-fi|eth0/i,
    openBrowser: true,
    clientRedirects:[
        {
            urlSrc:'/',
            redirectTo:'/tests/index.html'
        }
    ],
    urlRewrites: [
        {
            urlSrcRegexp:/^\/tests2/,
            replaceWith:'/tests'
        }
    ],
    textReplacements: [
        {
            queryVar:'r',
            queryVarRegexp:/^0\.[0-9]{3}$/,
            replaceRegexp:/THREEJSVERSION/g,
            defaultValue:'0.119',
            pathRegexp:/\.(html|js)|(\/)$/
        }
    ],
    buildOptions: {
        src:'./tests',
        dst:'./dist/v1.0.0/threejs.119',
        replaceRegexp:/THREEJSVERSION/g,
        defaultValue:'0.119',
        fileRegexp:/\.(html|jsm?)$/
    },
    monitorOptions:{
        enable:false,
        directories:[ './' ],
        fileRegexp:/\.(html|jsm?)$/,
        excludeRegexp: /node_modules/
    }
};

module.exports = config;
