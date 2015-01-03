module.exports = new Interface();

var schemas = {};

function Interface() {
	var env = new (require('./environment'))();

	this.compile = function(schema) {
		if (schema.id && schemas[schema.id]) { return schemas[schema.id]; }

		var sch = env.compile(schema);
		schemas[sch.id] = sch;
		return sch;
	};

	this.validate = env.validate.bind(env);

	this.getLastErrors = env.getLastErrors.bind(env);
	this.isLastValid = env.isLastValid.bind(env);

	this.environment = function() { return new Interface(); };

	require('./variables').apply(env);
	require('./types').apply(env);
	require('./validators').apply(env);

	require('./schemas').apply(env);
}

function SchemaInterface(schema) {
	var result = {};

	result.validate = schema.validate.bind(schema);
	result.getLastErrors = schema.getLastErrors.bind(schema);
	result.isLastValid = schema.isLastValid.bind(schema);

	return result;
}
