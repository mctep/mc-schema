var validator = require('../lib');

var schema = validator.compile({


	"type": "object",
	"required": ["foo"],
	"properties": {
		"foo": {
			"type": "string",
			"default": "abc"
		},
		"bar": {
			"type": "number",
			"default": 1
		}
	},
	"default": {	}
}
);


var result = schema.validate();

console.log(JSON.stringify(result, null ,4));
