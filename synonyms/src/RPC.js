/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RPC"] = factory();
	else
		root["RPC"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/RPC.ts":
/*!********************!*\
  !*** ./src/RPC.ts ***!
  \********************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.RPCallee = exports.RPCaller = void 0;\nclass RPCaller {\n    constructor(frameOrUrl) {\n        this.seqNum = 0;\n        this.callbacks = {};\n        if (typeof frameOrUrl === 'string') {\n            this.frame = document.createElement('iframe');\n            this.frame.src = frameOrUrl;\n            this.frame.style.cssText = \"width: 0; height: 0; border: 0; border: none; position: absolute;\";\n            document.body.appendChild(this.frame);\n        }\n        else {\n            this.frame = frameOrUrl;\n        }\n        this.ready = (async () => {\n            await new Promise((resolve) => {\n                this.frame.addEventListener('load', resolve);\n            });\n            // TODO: handshake\n        })();\n        window.addEventListener('message', (ev) => {\n            if (!ev.data || typeof ev.data !== 'object')\n                return;\n            const seqNum = ev.data.seqNum;\n            const callback = this.callbacks[seqNum];\n            if (ev.data.error) {\n                callback.reject(ev.data.error);\n            }\n            else {\n                callback.resolve(ev.data.result);\n            }\n            delete this.callbacks[ev.data.seqNum];\n        });\n    }\n    async call(args) {\n        await this.ready;\n        let seqNum = this.seqNum;\n        this.seqNum++;\n        this.frame.contentWindow.postMessage({ seqNum, args }, \"*\");\n        return await new Promise((resolve, reject) => this.callbacks[seqNum] = { resolve, reject });\n    }\n}\nexports.RPCaller = RPCaller;\nasync function exampleCaller() {\n    let rpc = new RPCaller(document.getElementById(\"iframe\"));\n    await rpc.ready;\n    const sum1 = await rpc.call([10, 20]);\n    document.getElementById(\"pre\").innerHTML += `10 + 20 = ${sum1}\\n`;\n    const sum2 = await rpc.call([sum1, sum1]);\n    document.getElementById(\"pre\").innerHTML += `${sum1} + ${sum1} = ${sum2}\\n`;\n}\nasync function exampleCallee() {\n    const wait = (ms) => new Promise(res => setTimeout(res, ms));\n    let rpc = new RPCallee(async ([a, b]) => {\n        wait(1000);\n        return a + b;\n    });\n}\nclass RPCallee {\n    constructor(handler) {\n        window.addEventListener('message', async (ev) => {\n            if (!ev.data || typeof ev.data !== 'object')\n                return;\n            const { seqNum, args } = ev.data;\n            try {\n                const result = await handler(args);\n                window.parent.postMessage({ seqNum, result }, \"*\");\n            }\n            catch (error) {\n                window.parent.postMessage({ seqNum, error }, \"*\");\n            }\n        });\n    }\n}\nexports.RPCallee = RPCallee;\n\n\n//# sourceURL=webpack://pane-client-lib/./src/RPC.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/RPC.ts"](0, __webpack_exports__);
/******/ 	
/******/ 	return __webpack_exports__;
/******/ })()
;
});