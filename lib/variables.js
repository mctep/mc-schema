module.exports = variables;

function variables() {
	this.addVariable('value');
	this.addVariable('parent');
	this.addVariable('property');
	this.addVariable('path');

	this.addVariable('type', function(value) {
		var type = typeof value;

		if (type === 'object') {
			if (Array.isArray(value)) {
				type = 'array';
			} else if (value === null) {
				type = 'null';
			}
		}

		if (type === 'number') {
			if ((value % 1) === 0) {
				type = 'integer';
			}
		}
	});

	this.addVariable('dataPath', function(path, property) {
		var dataPath = (path || '#/');
		if (property !== undefined) {
			if (dataPath[dataPath.length - 1] !== '/') {
				dataPath += '/';
			}

			dataPath += property;
		}
	});

	this.addVariable('typeOk', function() {
		var typeOk = false;
	});

	this.addVariable('typeError', function() {
		var typeError = [];
	});

	this.addVariable('self', function() {
		var self = this;
	});

	this.addVariable('schema', function() {
		var schema = this.schema;
	});

	this.addVariable('properties', function(value, type) {
		if (type == 'object') {
			var properties = Object.keys(value);
		}
	});

	this.addVariable('default', function(value, type, schema, parent, property) {
		if (type === 'undefined') {
			value = schema.default;
			type = typeof value;

			if (parent) {
				parent[property] = value;
			}
		}
	});

	this.addVariable('missings', function() {
		var missings = {};
	});

	this.addVariable('CLOSE_ENOUGH_LOW', function() {
		var CLOSE_ENOUGH_LOW = Math.pow(2, -51);
	});

	this.addVariable('CLOSE_ENOUGH_HIGH', function(CLOSE_ENOUGH_LOW) {
		var CLOSE_ENOUGH_HIGH = CLOSE_ENOUGH_LOW - 1;
	});
}
