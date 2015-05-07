var validator = require('../lib');

validator.addType('aaa', function(typeOk) {
	typeOk = true;
});

var schema = validator.compile(
	{
		type: 'aaa',
		items: {
			type: 'integer'
		}
	}
);

console.log(schema.validate(
	[1,2,3,2], { collectErrors: true }
));
