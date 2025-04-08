/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/buscar.js":
/*!**************************!*\
  !*** ./src/js/buscar.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n\r\ndocument.addEventListener('DOMContentLoaded', function () {\r\n\r\n    const buscaForm = document.querySelector(\"#buscar\");\r\n    buscaForm.addEventListener('submit', async (e) => {\r\n        console.log('1PK');\r\n        e.preventDefault();\r\n        const id = document.querySelector('input[name=\"id\"]').value\r\n        const termino = buscaForm.querySelector('input[name=\"termino\"]').value;\r\n\r\n        try {\r\n            console.log('2PK');\r\n            const url = `/propiedad/buscar`;\r\n            const csrfToken = document.querySelector('input[name=\"_csrf\"]').value;\r\n            const solicitud = await fetch(url, {\r\n                method: 'POST',\r\n                headers: {\r\n                    'X-CSRF-Token': csrfToken\r\n                }, body: JSON.stringify({ id, termino })\r\n            })\r\n            if (solicitud.ok) {\r\n                console.log('3PK');\r\n            }\r\n        } catch (error) {\r\n            console.error('Error:', error);\r\n        }\r\n    })\r\n})()\n\n//# sourceURL=webpack://bienesraices/./src/js/buscar.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/buscar.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;