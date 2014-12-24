module.exports = variables;

function variables() {
	this.addVariable('value');
	this.addVariable('parent');
	this.addVariable('property');

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
			if ((value | 0) == value) {
				type = 'integer';
			}
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
}