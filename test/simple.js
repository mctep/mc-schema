var validator = require('../lib');

var schema = validator.compile(
	{ "dependencies": {"bar": ["foo"]} }
);


schema.validate(
	{"bar": 2}
);

console.log(JSON.stringify(validator.getLastErrors(), null ,4));
