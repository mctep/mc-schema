var validator = require('../lib');

var schema = validator.compile(
	{
		type: 'array',
		items: {
			type: 'integer'
		}
	}
);

console.log(schema.validate(
	[1,2,'3',false], { collectErrors: true }
));
