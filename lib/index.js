module.exports = new Interface();

function Interface() {
	var env = new (require('./environment'))();

	this.compile = function(schema) {
		if (schema.__schemai) { return schema.__schemai; }

		schema.__schemai = new SchemaInterface(env.compile(schema));
		return schema.__schemai;
	};

	this.validate = function(schema, data, opts) {
		return this.compile(schema).validate(data, opts);
	};

	this.environment = function() { return new Interface(); };

	this.addTypeCoerce = env.addTypeCoerce.bind(env);

	require('./variables').apply(env);
	require('./types').apply(env);
	require('./formats').apply(env);
	require('./validators').apply(env);
	require('./type-coerce').apply(env);

	require('./schemas').apply(env);
}

function SchemaInterface(schema) {
	var result = {};

	result.validate = function(data, opts) {
		var out = schema.validate(data, opts);
		return {
			valid: !schema.errors.length,
			errors: schema.errors,
			data: out
		};
	};

	result.coerce = function(data) {
		return schema.coerce(data);
	};

	return result;
}
