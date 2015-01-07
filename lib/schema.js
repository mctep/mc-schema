module.exports = Schema;

var jsonPath = require('./json-path');

Schema.prototype.addError = addError;

Schema.prototype.validate = validate;
Schema.prototype.coerce = coerce;

Schema.prototype.isEqual = isEqual;
Schema.prototype.isArrayUnique = isArrayUnique;
Schema.prototype.getSchemaByPath = getSchemaByPath;

var MAX_ITERATIONS_QNT = 10;

var COERCE_FIRST_ORDER = [
	'ANY_OF_MISSING',
	'ONE_OF_MULTIPLE',
	'ONE_OF_MISSING',
	'NOT_PASSED',
	'INVALID_TYPE',

	'ENUM_MISMATCH',

	'STRING_LENGTH_LONG',
	'STRING_LENGTH_SHORT',
	'STRING_PATTERN',

	'NUMBER_MINIMUM_EXCLUSIVE',
	'NUMBER_MINIMUM',
	'NUMBER_MAXIMUM_EXCLUSIVE',
	'NUMBER_MAXIMUM',
	'NUMBER_MULTIPLE_OF',

	'OBJECT_DEPENDENCY_KEY'
].reverse();

var COERCE_SECOND_ORDER = [
	'OBJECT_REQUIRED',
	'OBJECT_ADDITIONAL_PROPERTIES',
	'OBJECT_PROPERTIES_MAXIMUM',
	'OBJECT_PROPERTIES_MINIMUM',

	'ARRAY_ADDITIONAL_ITEMS',
	'ARRAY_LENGTH_LONG',
	'ARRAY_LENGTH_SHORT',
	'ARRAY_UNIQUE'
].reverse();

function Schema(fn, schema, env, root) {
	this.__validate = fn;
	this.env = env;
	this.schema = schema;

	this.rootSchema = root = root || this;
	var self = this;

	if (typeof schema.properties === 'object') {
		schema.__properties = {};
		Object.keys(schema.properties).forEach(function(prop) {
			var subSchema = env.compile(schema.properties[prop], root);
			schema.__properties[prop] = subSchema;
		});
	}

	if ('patternProperties' in schema) {
		schema.__patternProperties = {};
		Object.keys(schema.patternProperties).forEach(function(prop) {
			var subSchema = env.compile(schema.patternProperties[prop], root);
			schema.__patternProperties[prop] = subSchema;
		});
	}

	if (typeof schema.additionalProperties === 'object') {
		schema.__additionalProperties = env.compile(schema.additionalProperties, root);
	}

	if (typeof schema.additionalItems === 'object') {
		schema.__additionalItems = env.compile(schema.additionalItems, root);
	}

	if (schema.items) {
		if (Array.isArray(schema.items)) {
			schema.__items = schema.items.map(function(item) {
				return env.compile(item, root);
			});
		} else {
			schema.__items = env.compile(schema.items, root);
		}
	}

	if (schema.allOf) {
		schema.__allOf = schema.allOf.map(function(item) {
			return env.compile(item, root);
		});
	}

	if (schema.anyOf) {
		schema.__anyOf = schema.anyOf.map(function(item) {
			return env.compile(item, root);
		});
	}

	if (schema.oneOf) {
		schema.__oneOf = schema.oneOf.map(function(item) {
			return env.compile(item, root);
		});
	}

	if (schema.not) {
		schema.__not = env.compile(schema.not, root);
	}

	if (schema.definitions) {
		schema.__definitions = {};
		Object.keys(schema.definitions).forEach(function(prop) {
			var subSchema = env.compile(schema.definitions[prop], root);
			schema.__definitions[prop] = subSchema;
		});
	}

	if (schema.dependencies) {
		Object.keys(schema.dependencies).forEach(function(prop) {
			if (!Array.isArray(schema.dependencies[prop])) {
				schema.__dependencies = schema.__dependencies || {};
				schema.__dependencies[prop] = env.compile(schema.dependencies[prop], root);
			}
		});
	}
}

function validate(data) {
	var result = this.__validate(data);
	this.env.errors = this.errors;
	return result;
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

function coerce(data, iteration) {
	iteration = iteration || 0;
	if (iteration > MAX_ITERATIONS_QNT) {
		throw 'Iterations exceed';
	}

	if (data === undefined) { return data; }

	this.validate(data);

	if (!this.errors || !this.errors.length) {
		return data;
	}

	var errors = this.errors;

	var groupsByPathes = {};
	var pathes = [];
	var idx = errors.length;

	var needPrecoerce = false;

	while (idx--) {
		var error = errors[idx];
		var path = error.dataPath;
		if (COERCE_FIRST_ORDER.indexOf(error.code) !== -1) {
			needPrecoerce = true;
		}

		if (!groupsByPathes[path]) {
			groupsByPathes[path] = [];
			pathes.push(path);
		}

		groupsByPathes[path].push(error);
	}

	pathes = pathes.sort();

	if (needPrecoerce) {
		data = preCoerce(data, pathes, groupsByPathes, this.env);
	} else {
		data = postCoerce(data, pathes, groupsByPathes);
	}

	return this.coerce(data, iteration + 1);
}

function getErrorsByCode(errors, code) {
	var result = [];
	var idx = errors.length;
	while (idx--) {
		if (errors[idx].code == code) {
			result.push(errors[idx]);
		}
	}
	return result;
}

function preCoerce(data, pathes, groupsByPathes, env) {
	var idx = pathes.length;
	while (idx--) {
		var pathErrors = groupsByPathes[pathes[idx]];

		var idxCoerce = COERCE_FIRST_ORDER.length;

		while (idxCoerce--) {
			var code = COERCE_FIRST_ORDER[idxCoerce];
			var errors = getErrorsByCode(pathErrors, code);

			var idxError = errors.length;
			if (!idxError) { continue; }

			while (idxError--) {
				var error = errors[idxError];

				if (code === 'INVALID_TYPE') {
					var coerce = env.typeCoerce[error.expected[0]];
					if (coerce) {
						var value = coerce(jsonPath.get(data, error.dataPath));

						if (value === undefined) {
							data = jsonPath.remove(data, error.dataPath);
						} else {
							data = jsonPath.set(data, error.dataPath, value);
						}
					} else {
						data = jsonPath.remove(data, error.dataPath);
					}
				} else {
					data = jsonPath.remove(data, error.dataPath);
				}
			}

			break;
		}
	}

	return data;
}

function postCoerce(data, pathes, groupsByPathes) {
	var idx = pathes.length;
	while (idx--) {
		var pathErrors = groupsByPathes[pathes[idx]];

		var idxCoerce = COERCE_SECOND_ORDER.length;

		while (idxCoerce--) {
			var code = COERCE_SECOND_ORDER[idxCoerce];
			var errors = getErrorsByCode(pathErrors, code);

			var idxError = errors.length;
			if (!idxError) { continue; }

			var toBreak = false;

			while(idxError--) {
				var error = errors[idxError];

				if (code === 'OBJECT_ADDITIONAL_PROPERTIES') {
					var property = error.actual;
					data = jsonPath.remove(data, error.dataPath + '/' + property);
				} else if (code === 'ARRAY_ADDITIONAL_ITEMS') {
					var value = jsonPath.get(data, error.dataPath);
					value.splice(error.expected, error.actual - error.expected);
					data = jsonPath.set(data, error.dataPath, value);
				} else {
					data = jsonPath.remove(data, error.dataPath);
					toBreak = true;
				}
			}

			if (toBreak) {
				break;
			}
		}
	}

	return data;
}
