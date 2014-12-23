module.exports = Schema;

Schema.prototype.addError = addError;
Schema.prototype.getLastErrors = getLastErrors;
Schema.prototype.validate = validate;

function Schema(fn, schema, env) {
	this.__validate = fn;
	this.env = env;
	this.schema = schema;

	if ('properties' in schema) {
		schema.__properties = {};
		Object.keys(schema.properties).forEach(function(prop) {
			var subSchema = env.compile(schema.properties[prop]);
			schema.__properties[prop] = subSchema.__validate.bind(subSchema);
		});
	}

	if ('items' in schema) {
		var subSchemaItems = env.compile(schema.items);
		schema.__items = subSchemaItems.__validate.bind(subSchemaItems);
	}
}

function validate(data) {
	var result = this.__validate(data);
	this.env.errors = this.errors;
	return result;
}

function getLastErrors() {
	return this.errors;
}

function addError(err) {
	this.errors.push(err);
}
