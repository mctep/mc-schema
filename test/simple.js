var validator = require('../lib');

var schema = validator.compile(
	{
		$ref: 'http://json-schema.org/draft-04/schema#'
	}
);


schema.validate(
	{
        type: 1
    }
);

console.log(validator.getLastErrors());
