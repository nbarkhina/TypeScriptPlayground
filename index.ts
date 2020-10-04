declare var rivets, $, Split;


export class MyApp {

    message: string = '';
    compileResult: string = '';
    areaHeight = 400;
    debugMode: boolean = false;

    constructor() {

        this.areaHeight = window.innerHeight - 280;
        if (this.areaHeight < 400)
            this.areaHeight = 400;

        this.configureSplit();
        this.resizeArea();
        this.bindRivets();
        this.setupMonaco();

    }

    configureSplit() {
        Split(['.editorLeft', '.editorRight'], {
            gutterSize: 5,
            sizes: [70, 30]
        });
    }

    resizeArea() {
        document.getElementById('mainEditor').style.height = this.areaHeight + 'px';
        document.getElementById('divOutput').style.height = this.areaHeight + 'px';
        document.getElementById('splitOuter').style.height = this.areaHeight + 'px';
    }

    shrink() {
        this.areaHeight -= 50;
        this.resizeArea();
    }

    grow() {
        this.areaHeight += 50;
        this.resizeArea();
    }

    bindRivets() {
        rivets.bind($('body'), { data: this });
    }

    reactTypings: string = '';
    sampleCode1 = '';
    sampleCode2 = '';
    sampleCode3 = '';

    async setupMonaco() {

        //Canvas Example
        var response = await fetch('./sample.ts');
        this.sampleCode1 = await response.text();

        //React Basic
        var response = await fetch('./sample_react_simple.txt');
        this.sampleCode2 = await response.text();

        //React Table
        var response = await fetch('./sample_react_table.txt');
        this.sampleCode3 = await response.text();
        

        //Default
        var result = this.sampleCode3;

        var oldCode = localStorage.getItem('tsPlaygroundCode');
        if (oldCode)
            result = oldCode;

        //load sample from query string if available
        let loadSample = localStorage.getItem('tsLoadSample');
        if (loadSample == "sample1")
            result = this.sampleCode1;
        if (loadSample == "sample2")
            result = this.sampleCode2;
        if (loadSample == "sample3")
            result = this.sampleCode3;
        localStorage.setItem('tsLoadSample', '');

        response = await fetch('./node_modules/@types/react/index.d.ts');
        this.reactTypings = await response.text();

        //NOT WORKING CURRENTLY
        // response = await fetch('./node_modules/@types/react-dom/index.d.ts');
        // this.reactDomTypings = await response.text();



        require(["vs/editor/editor.main"], function () {

            //set monaco compiler settings
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                jsx: monaco.languages.typescript.JsxEmit.React,
                target: monaco.languages.typescript.ScriptTarget.ES6,
                allowNonTsExtensions: true,
                moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.CommonJS
            });


            //react typings
            var libSource = myApp.reactTypings;
            var libUri = 'types/react/index.ts';
            // monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri); //not sure if this is needed?
            monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));

            //react-dom typings not working
            // libSource = myApp.reactDomTypings;
            // libUri = 'types/reactdom/index.ts';
            // monaco.languages.typescript.typescriptDefaults.addExtraLib(libSource, libUri);
            // monaco.editor.createModel(libSource, 'typescript', monaco.Uri.parse(libUri));


            // Create the editor model
            // needs to be .tsx extension otherwise JSX doesn't work
            var editorModel = monaco.editor.createModel(result, 'typescript', monaco.Uri.file('/main.tsx'))

            var options = {
                model: editorModel,
                language: 'typescript',
                theme: "vs-light",
                vertical: 'visible',
                horizontal: 'visible',
                automaticLayout: 'true'
            };



            window["myEditor"] = monaco.editor.create(document.getElementById('mainEditor'), options);
            window["myEditor"].addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
                myApp.runApp();
            });



            if (myApp.debugMode) {
                $("#monacoDebug").show();
                var optionsDebug = {
                    language: 'typescript',
                    theme: "vs-light",
                    vertical: 'visible',
                    horizontal: 'visible',
                    automaticLayout: 'true'
                };

                window["myEditorDebug"] = monaco.editor.create(document.getElementById('monacoDebug'), optionsDebug);
            }

            myApp.runApp();
            $("#splitOuter").css('opacity', '1');
            $("#divLoading").hide();
            $("#divMessage").show();

        });
    }

    loadSample(){
        var sample = $('#ddlSample').val();
        if (sample){
            localStorage.setItem('tsLoadSample', sample);
            window.location.reload();
        }
    }

    runApp() {
        console.log('compiling source...');
        try {
            let source = window["myEditor"].getValue() as string;
            localStorage.setItem('tsPlaygroundCode', source);



            let result = ts.transpileModule(source, {
                compilerOptions: {
                    module: ts.ModuleKind.None,
                    target: ts.ScriptTarget.ES2015,
                    moduleResolution: ts.ModuleResolutionKind.NodeJs,
                    strictNullChecks: true,
                    jsx: ts.JsxEmit.React,
                }
            });

            console.log(result);

            this.compileResult = result.outputText;

            //only for JSX
            if (this.compileResult.indexOf('./types/react') > 0) {
                this.compileResult = this.compileResult.substr(this.compileResult.indexOf('./types/react') + 17);
                this.compileResult = this.compileResult.replace(new RegExp('react_1', 'g'), 'React');
                this.compileResult = this.compileResult.replace(new RegExp('React.default', 'g'), 'React');
            }

            if (this.debugMode) {
                window["myEditorDebug"].setValue(this.compileResult);
            }


            //execute compiled code
            eval(this.compileResult);



            this.message = '';

        } catch (error) {
            console.log('Error: ' + error);
            this.message = 'Error: ' + error;
        }
    }

    parseQueryString() {
        var query = {};
        let queryString = window.location.href;
        queryString = queryString.substring(queryString.indexOf('?') + 1);
        var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
        return query;
    }

}

var myApp = new MyApp();
window["myApp"] = myApp;