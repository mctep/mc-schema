var validator = require('../lib');

var schema = validator.compile(
	{"$ref": "http://json-schema.org/draft-04/schema#"}
);

console.log(schema.validate(
	{"minLength": 1}
));
