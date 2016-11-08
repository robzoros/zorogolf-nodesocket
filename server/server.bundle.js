/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';

	var React = __webpack_require__(1),
	    path = __webpack_require__(2),
	    compression = __webpack_require__(3),
	    renderToString = __webpack_require__(4).renderToString,
	    reactRouter = __webpack_require__(5),
	    match = reactRouter.match,
	    RouterContext = reactRouter.RouterContext,
	    routes = __webpack_require__(6),
	    express = __webpack_require__(9);

	var app = express();
	var server = __webpack_require__(10).Server(app);
	var io = __webpack_require__(11)(server);

	var messages = [{
	    id: 1,
	    text: "Hola soy un mensaje",
	    author: "Carlos Azaustre"
	}];

	app.use(compression());
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, '../public'));

	// serve our static stuff like index.css
	app.use(express.static(path.join(__dirname, '../public'), { index: false }));

	app.get('*', function (req, res) {
	    match({ routes: routes, location: req.url }, function (err, redirect, props) {
	        if (err) {
	            res.status(500).send(err.message);
	        } else if (redirect) {
	            res.redirect(redirect.pathname + redirect.search);
	        } else if (props) {
	            // hey we made it!
	            var appHtml = renderToString(React.createElement(RouterContext, props));
	            return res.render('index', { markup: appHtml });
	        } else {
	            res.status(404).send('Not Found');
	        }
	    });
	});

	io.on('connection', function (socket) {
	    console.log(new Date() + ': Alguien se ha conectado con Sockets.');
	    socket.emit('messages', messages);

	    socket.on('new-message', function (data) {
	        messages.push(data);

	        io.sockets.emit('messages', messages);
	    });
	});

	var PORT = process.env.PORT || 8080;
	server.listen(PORT, function () {
	    console.log('Production Express server running at localhost:' + PORT);
	});
	/* WEBPACK VAR INJECTION */}.call(exports, "server"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("compression");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("react-dom/server");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("react-router");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	var _reactRedux = __webpack_require__(7);

	var _app = __webpack_require__(8);

	var _app2 = _interopRequireDefault(_app);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*import Principal from '../ui/barra_nav.jsx'
	import PartidasUI  from '../ui/partidas.jsx'
	import Partida  from '../ui/partida.jsx'
	import Store from './store/store' */

	var routes = _react2.default.createElement(_reactRouter.Route, { path: '/', component: _app2.default });

	// route components
	exports.default = routes;

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("react-redux");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactRouter = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Inicio = function (_Component) {
	  _inherits(Inicio, _Component);

	  function Inicio() {
	    _classCallCheck(this, Inicio);

	    return _possibleConstructorReturn(this, (Inicio.__proto__ || Object.getPrototypeOf(Inicio)).apply(this, arguments));
	  }

	  _createClass(Inicio, [{
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'header',
	        null,
	        _react2.default.createElement(
	          'div',
	          { className: 'header-content' },
	          _react2.default.createElement(
	            'div',
	            { className: 'header-content-inner' },
	            _react2.default.createElement(
	              'h1',
	              null,
	              'Help to develop Zorogolf'
	            ),
	            _react2.default.createElement('hr', null),
	            _react2.default.createElement(
	              'p',
	              null,
	              'Zorogolf is a board game designed by Roberto M\xE9ndez that simulates a golf game match. Learn to play Zorogolf and help to develop the game.'
	            ),
	            _react2.default.createElement(
	              _reactRouter.Link,
	              { to: '/partidas', className: 'btna btn-primary btn-xl page-scroll' },
	              'Continue'
	            )
	          )
	        )
	      );
	    }
	  }]);

	  return Inicio;
	}(_react.Component);

	exports.default = Inicio;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = require("http");

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("socket.io");

/***/ }
/******/ ]);