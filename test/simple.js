var validator = require('../lib');

validator.addValidator('aaa', function(value, type, schema, dataPath, collectErrors) {
	if (type === 'string' && value.length > schema.aaa) {
		this.addError({
			code: 'STRING_LENGTH_LONG',
			expected: schema.aaa,
			actual: value.length,
			dataPath: dataPath
		});
		if (!collectErrors) { return value; }
	}
});

var schema = validator.compile(
	{
		aaa: 3
	}
);

console.log(schema.validate(
	'1233', { collectErrors: true }
));
