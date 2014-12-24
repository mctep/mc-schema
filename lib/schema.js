module.exports = Schema;

var jsonPath = require('./json-path');

Schema.prototype.addError = addError;
Schema.prototype.getLastErrors = getLastErrors;
Schema.prototype.validate = validate;
Schema.prototype.isLastValid = isLastValid;
Schema.prototype.isEqual = isEqual;
Schema.prototype.isArrayUnique = isArrayUnique;
Schema.prototype.getSchemaByPath = getSchemaByPath;

function Schema(fn, schema, env, root) {
	this.__validate = fn;
	this.env = env;
	this.schema = schema;

	this.rootSchema = root || this;
	var self = this;

	if (typeof schema.properties === 'object') {
		schema.__properties = {};
		Object.keys(schema.properties).forEach(function(prop) {
			var subSchema = env.compile(schema.properties[prop], self);
			schema.__properties[prop] = subSchema;
		});
	}

	if ('patternProperties' in schema) {
		schema.__patternProperties = {};
		Object.keys(schema.patternProperties).forEach(function(prop) {
			var subSchema = env.compile(schema.patternProperties[prop], self);
			schema.__patternProperties[prop] = subSchema;
		});
	}

	if (typeof schema.additionalProperties === 'object') {
		schema.__additionalProperties = env.compile(schema.additionalProperties, self);
	}

	if (typeof schema.additionalItems === 'object') {
		schema.__additionalItems = env.compile(schema.additionalItems, self);
	}

	if (schema.items) {
		if (Array.isArray(schema.items)) {
			schema.__items = schema.items.map(function(item) {
				return env.compile(item, self);
			});
		} else {
			schema.__items = env.compile(schema.items, self);
		}
	}

	// if (schema.definitions)
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
			if (!isEqual(val1[keys1[idx2]], val2[keys1[idx2]])) {
				return false;
			}
		}

		return true;
	}

	return false;
}

function isArrayUnique(arr, indexes) {
    var i, j, l = arr.length;
    for (i = 0; i < l; i++) {
        for (j = i + 1; j < l; j++) {
            if (isEqual(arr[i], arr[j])) {
                if (indexes) { indexes.push(i, j); }
                return false;
            }
        }
    }
    return true;
}

function getSchemaByPath(path) {
	path = decodeURIComponent(path);

	var schema = jsonPath.get(this.rootSchema.schema, path);

	if (!schema) { return; }

	return this.env.compiled[schema.id];
}
