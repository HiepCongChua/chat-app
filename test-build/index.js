'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
var hostname = "localhost";
var port = 3000;
app.get('/test', function (req, res) {
    res.send('<h1>Hello World !</h1>');
});
app.listen(port, hostname, function () {
    console.log('Hello world !');
});