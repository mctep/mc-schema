module.exports = schemas;

var fs = require('fs');
var schema4 = require('./json-schema-v4');

function schemas() {
	this.compile(schema4);
}
