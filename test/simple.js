var validator = require('../lib');

validator.validate(
	{"$ref": "http://json-schema.org/draft-04/schema#"},

	{
        "definitions": {
            "foo": {"type": 1}
        }
    }

);

console.log(validator.getLastErrors());
