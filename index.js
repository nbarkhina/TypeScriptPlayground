var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class MyApp {
        constructor() {
            this.message = '';
            this.compileResult = '';
            this.areaHeight = 400;
            this.debugMode = false;
            this.reactTypings = '';
            this.sampleCode1 = '';
            this.sampleCode2 = '';
            this.sampleCode3 = '';
            this.sampleCode4 = '';
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
        setupMonaco() {
            return __awaiter(this, void 0, void 0, function* () {
                //Canvas Example
                var response = yield fetch('./sample.ts');
                this.sampleCode1 = yield response.text();
                //React Basic
                var response = yield fetch('./sample_react_simple.txt');
                this.sampleCode2 = yield response.text();
                //React Table
                var response = yield fetch('./sample_react_table.txt');
                this.sampleCode3 = yield response.text();
                //React Todos
                var response = yield fetch('./sample_react_todos.txt');
                this.sampleCode4 = yield response.text();
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
                if (loadSample == "sample4")
                    result = this.sampleCode4;
                localStorage.setItem('tsLoadSample', '');
                response = yield fetch('./node_modules/@types/react/index.d.ts');
                this.reactTypings = yield response.text();
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
                    var editorModel = monaco.editor.createModel(result, 'typescript', monaco.Uri.file('/main.tsx'));
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
            });
        }
        loadSample() {
            var sample = $('#ddlSample').val();
            if (sample) {
                localStorage.setItem('tsLoadSample', sample);
                window.location.reload();
            }
        }
        runApp() {
            console.log('compiling source...');
            try {
                let source = window["myEditor"].getValue();
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
            }
            catch (error) {
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
    exports.MyApp = MyApp;
    var myApp = new MyApp();
    window["myApp"] = myApp;
});
//# sourceMappingURL=index.js.map