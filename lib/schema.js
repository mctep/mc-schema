module.exports = Schema;

Schema.prototype.addError = addError;
Schema.prototype.getLastErrors = getLastErrors;
Schema.prototype.validate = validate;
Schema.prototype.isLastValid = isLastValid;
Schema.prototype.isEqual = isEqual;

function Schema(fn, schema, env) {
	this.__validate = fn;
	this.env = env;
	this.schema = schema;

	if ('properties' in schema) {
		schema.__properties = {};
		Object.keys(schema.properties).forEach(function(prop) {
			var subSchema = env.compile(schema.properties[prop]);
			schema.__properties[prop] = subSchema;
		});
	}

	if ('patternProperties' in schema) {
		schema.__patternProperties = {};
		Object.keys(schema.patternProperties).forEach(function(prop) {
			var subSchema = env.compile(schema.patternProperties[prop]);
			schema.__patternProperties[prop] = subSchema;
		});
	}

	if (typeof schema.additionalProperties === 'object') {
		schema.__additionalProperties = env.compile(schema.additionalProperties);
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

function isLastValid() {
	return !this.errors.length;
}

function addError(err) {
	this.errors.push(err);
}

function isEqual(val1, val2) {
	if (val1 === val2) {
		return true;
	}

	var isArr1 = Array.isArray(val1);
	var isArr2 = Array.isArray(val2);

	if (isArr1 && isArr2) {
		if (val1.length != val2.length) { return false; }

		var idx = val1.length;
		while (idx--) {
			if (!isEqual(val1[idx], val2[idx])) {
				return false;
			}
		}

		return true;
	}

	if (
		!isArr1 && !isArr2 && val1 instanceof Object && val2 instanceof Object
	) {
		var keys1 = Object.keys(val1);
		var keys2 = Object.keys(val2);

		if (!isEqual(keys1, keys1)) { return false; }

		var idx2 = keys1.length;

		while (idx2--) {
			if (!isEqual(val1[keys1[idx2--]], val2[keys1[idx2--]])) {
				return false;
			}
		}

		return true;
	}

	return false;
}