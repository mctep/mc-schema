var validator = require('../lib');

validator.addTypeCoerce('object', function(value) {
	try {
		return JSON.parse(value);
	} catch (e) {}
});

var schema = validator.compile({
	type: 'object',
	properties: {
		foo: { type: 'number' }
	}
});

console.log(schema.coerce('{"foo":"1"}'));
