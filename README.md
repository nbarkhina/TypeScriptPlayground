# TypeScript Playground
This is a fully web based TypeScript development environment with React support to help learn these technologies within a simple to use interface. There are many of these out on the internet however I wanted to create one with these goals -

- Fully web based (no server side code)
- Full intellisense support for TypeScript 
- Full intellisense support for React Library and JSX
- Code is compiled within the browser using the TypeScript JS Library
- Easy to use interface, no bells and whistles

View demo here -

https://www.neilb.net/tsPlayground/


# Technical Details
There were two main challenges with this project. One was working with the TypeScript compiler API to get it to emit code that I could dynamically load into the browser. The second was working with the Monaco Code Editor to get intellisense for React and JSX. I spent alot of time experimenting with these 2 components and different compiler options before I was able to get it work. The Monaco Editor (which also powers VS Code) is very powerful. However I did not find a lot of information and code examples on the internet that dealt with some of the more complex scenarios such as referencing external libraries. After the JS code is emitted I use a JavaScript eval() to run the code. For JSX I had make small modififcations to the emitted code in order to get it to run. Originally I was trying to load it as an AMD module, but then ultimately settled on just updating the compiled output. This is an area I am still working to improve.


# Build
To Build the project first install TypeScript and the dependencies

`npm install -g typescript`

`npm install`

Then use the TypeScript Compiler to build the JavaScript Files

`tsc`

# Libraries
This app makes use of the following libraries:

- Bootstrap - overall styling and mobile layout 
- JQuery - some DOM manipulation and Ajax calls
- RivetsJS - lightweight model view JavaScript Framework
- Monaco Editor - Web based Code Editor
- TypeScript - strongly typed superset of Javascript 
- React - Javascript library for managing view 
- RequireJS - AMD module loader
- Font Awesome - great icon pack
- SplitJS - handles the split view between Editor and Output

