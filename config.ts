declare var requirejs, require,monaco;

requirejs.config({
    paths: {
        "vs": "node_modules/monaco-editor/min/vs",
        "react": "https://unpkg.com/react@16.9.0/umd/react.development",
        "react-dom": "https://unpkg.com/react-dom@16.9.0/umd/react-dom.development",
    },
    urlArgs: function (id, url) {
        var rando = Math.floor(Math.random() * Math.floor(100000));
        var args = '';
        if (url.indexOf('index.js')>-1)
            args = '?v=' + rando;
        return args;
    }

});

require(["react"],function(a){
    window["React"] = a;
    require(["react-dom"],function(b){
        window["ReactDOM"] = b;
        require(["index"]);
    })
})


