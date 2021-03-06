module.exports = validators;

function validators() {
	this.addValidator('returnIfTypeError', function(value, typeOk, typeError, type, dataPath) {
		if (typeOk === false) {
			this.addError({
				code: 'INVALID_TYPE',
				expected: typeError,
				actual: type,
				dataPath: dataPath
			});

			return value;
		}
	});

	this.addValidator('required', function(properties, value, schema, type, dataPath, collectErrors) {
		if (type === 'object') {
			var __r_idx = schema.required.length;
			var __r_missings = [];

			while (__r_idx--) {
				var __r_prop = schema.required[__r_idx];
				if (value[__r_prop] === undefined) {
					var __r_miss_default = schema.properties && schema.properties[__r_prop] && schema.properties[__r_prop].default;

					if (__r_miss_default !== undefined) {
						value[__r_prop] = JSON.parse(JSON.stringify(__r_miss_default));
						properties.push(__r_prop);
						if (!collectErrors) { break; }
					} else {
						__r_missings.push(__r_prop);
					}
				}
			}

			if (__r_missings.length) {
				this.addError({
					code: 'OBJECT_REQUIRED',
					expected: schema.required,
					actual: properties,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		}
	});

	this.addValidator('additionalProperties', 'properties');
	this.addValidator('patternProperties', 'properties');

	this.addValidator('properties', function(value, schema, type, properties, dataPath, collectErrors) {
		if (type == 'object') {
			if (schema.patternProperties) {
				var __p_pp = Object.keys(schema.patternProperties);
			}

			var __p_idx = properties.length;
			while (__p_idx--) {
				var __p_matched = false;
				var __p_prop = properties[__p_idx];
				var __p_value = value[__p_prop];
				var __p_prop_schema = schema.__properties && schema.__properties[__p_prop];

				if (__p_prop_schema !== undefined) {
					__p_matched = true;
					if (__p_value !== undefined) {
						__p_prop_schema.__validate(__p_value, collectErrors, value, __p_prop, dataPath, this.errors);
						if (!collectErrors && this.errors.length) { return value; }
					}
				}

				if (__p_pp) {
					var __p_ppi = __p_pp.length;
					while (__p_ppi--) {
						if (RegExp(__p_pp[__p_ppi]).test(__p_prop)) {
							__p_matched = true;

							var __p_pprop_schema = schema.__patternProperties[__p_pp[__p_ppi]];
							if (__p_value !== undefined) {
								__p_pprop_schema.__validate(__p_value, collectErrors, value, __p_prop, dataPath, this.errors);
								if (!collectErrors && this.errors.length) { return value; }
							}
						}
					}
				}

				if (!__p_matched && schema.additionalProperties !== undefined) {
					if (schema.additionalProperties === false) {
						this.addError({
							code: 'OBJECT_ADDITIONAL_PROPERTIES',
							actual: __p_prop,
							dataPath: dataPath
						});
						if (!collectErrors) { return value; }
					} else if (schema.additionalProperties !== true) {
						schema.__additionalProperties.__validate(__p_value, collectErrors, value, __p_prop, dataPath, this.errors);
						if (!collectErrors && this.errors.length) { return value; }
					}
				}

				__p_value = value[__p_prop];
			}
		}
	});

	this.addValidator('additionalItems', 'items');

	this.addValidator('items', function(value, type, schema, self, dataPath, collectErrors) {
		if (type === 'array') {
			var __i_idx = value.length;
			var __i__items = schema.items || {};

			var __i_is_array = Array.isArray(__i__items);

			if (__i_is_array && value.length > schema.__items.length && schema.additionalItems === false) {
				this.addError({
					code: 'ARRAY_ADDITIONAL_ITEMS',
					expected: schema.__items.length,
					actual: value.length,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			} else {
				while (__i_idx--) {
					var __i_item = value[__i_idx];
					var __i_schema;

					if (__i_is_array) {
						__i_schema = schema.__items[__i_idx] || schema.__additionalItems;
					} else {
					 	__i_schema = schema.__items;
					}

					if (__i_schema) {
						__i_schema.__validate(value[__i_idx], collectErrors, value, __i_idx, dataPath, this.errors);
						if (!collectErrors && this.errors.length) { return value; }
					}
				}
			}
		}
	});

	this.addValidator('maxItems', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'array' && value.length > schema.maxItems) {
			this.addError({
				code: 'ARRAY_LENGTH_LONG',
				expected: schema.maxItems,
				actual: value.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('minItems', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'array' && value.length < schema.minItems) {
			this.addError({
				code: 'ARRAY_LENGTH_SHORT',
				expected: schema.minItems,
				actual: value.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('maxLength', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'string' && value.length > schema.maxLength) {
			this.addError({
				code: 'STRING_LENGTH_LONG',
				expected: schema.maxLength,
				actual: value.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('minLength', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'string' && value.length < schema.minLength) {
			this.addError({
				code: 'STRING_LENGTH_SHORT',
				expected: schema.minLength,
				actual: value.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('maxProperties', function(value, type, schema, properties, dataPath, collectErrors) {
		if (type === 'object' && properties.length > schema.maxProperties) {
			this.addError({
				code: 'OBJECT_PROPERTIES_MAXIMUM',
				expected: schema.maxProperties,
				actual: properties.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('minProperties', function(value, type, schema, properties, dataPath, collectErrors) {
		if (type === 'object' && properties.length < schema.minProperties) {
			this.addError({
				code: 'OBJECT_PROPERTIES_MINIMUM',
				expected: schema.minProperties,
				actual: properties.length,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('dependencies', function(value, type, schema, properties, dataPath, collectErrors) {
		if (type === 'object') {
			var __dep_idx = properties.length;

			while (__dep_idx--) {
				var __dep_prop = properties[__dep_idx];

				if (schema.dependencies.hasOwnProperty(__dep_prop)) {
					var __dep_needed = schema.dependencies[__dep_prop];

					if (Array.isArray(__dep_needed)) {
						var __dep_idx2 = __dep_needed.length;
						var __dep_missing = [];

						while (__dep_idx2--) {
							var __dep_prop2 = __dep_needed[__dep_idx2];

							if (properties.indexOf(__dep_prop2) === -1) {
								__dep_missing.push(__dep_prop2);
								if (!collectErrors) { break; }
							}
						}

						if (__dep_missing.length) {
							this.addError({
								code: 'OBJECT_DEPENDENCY_KEY',
								expected: __dep_missing,
								dependent: __dep_prop,
								dataPath: dataPath
							});
							if (!collectErrors) { return value; }
						}
					} else {
						var __dep_schema = schema.__dependencies[__dep_prop];
						__dep_schema.__validate(value, collectErrors);

						if (__dep_schema.errors.length) {
							this.addError({
								code: 'OBJECT_DEPENDENCY_KEY',
								dependent: __dep_prop,
								dataPath: dataPath
							});
							if (!collectErrors) { return value; }
						}
					}
				}
			}
		}
	});

	this.addValidator('enum', function(value, schema, type, properties, dataPath, collectErrors) {
		var __e_idx = schema.enum.length;
		var __e_valid = false;
		while (__e_idx--) {
			var __e_item = schema.enum[__e_idx];

			if (this.isEqual(__e_item, value)) {
				__e_valid = true;
				break;
			}
		}

		if (__e_valid === false) {
			this.addError({
				code: 'ENUM_MISMATCH',
				expected: schema.enum,
				actual: value,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('minimum', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'integer' || type === 'number') {
			if (schema.exclusiveMinimum) {

				if (value <= schema.minimum) {
					this.addError({
						code: 'NUMBER_MINIMUM_EXCLUSIVE',
						expected: schema.minimum,
						actual: value,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			} else {
				if (value < schema.minimum) {
					this.addError({
						code: 'NUMBER_MINIMUM',
						expected: schema.minimum,
						actual: value,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		}
	});

	this.addValidator('maximum', function(value, type, schema, dataPath, collectErrors) {
		if (type === 'integer' || type === 'number') {
			var __max;

			if (schema.exclusiveMaximum) {
				if (value >= schema.maximum) {
					this.addError({
						code: 'NUMBER_MAXIMUM_EXCLUSIVE',
						expected: schema.maximum,
						actual: value,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			} else {
				if (value > schema.maximum) {
					this.addError({
						code: 'NUMBER_MAXIMUM',
						expected: schema.maximum,
						actual: value,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		}
	});

	this.addValidator('multipleOf', function(value, type, schema, CLOSE_ENOUGH_LOW, CLOSE_ENOUGH_HIGH, dataPath, collectErrors) {
		if (type === 'integer' || type === 'number') {
			var __mof = (value / schema.multipleOf) % 1;

			if (__mof < 0) { __mof = Math.abs(__mof); }

			if (__mof >= CLOSE_ENOUGH_LOW || __mof < CLOSE_ENOUGH_HIGH) {
				this.addError({
					code: 'NUMBER_MULTIPLE_OF',
					expected: schema.multipleOf,
					actual: value,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		}
	});

	this.addValidator('uniqueItems', function(type, schema, value, dataPath, collectErrors) {
		if (type === 'array' && schema.uniqueItems === true) {
			var __uni_ids = [];
			if (this.isArrayUnique(value, __uni_ids) === false) {
				this.addError({
					code: 'ARRAY_UNIQUE',
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		}
	});

	this.addValidator('pattern', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (RegExp(schema.pattern).test(value) === false) {
				this.addError({
					code: 'STRING_PATTERN',
					expected: schema.pattern,
					actual: value,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		}
	});

	this.addValidator('$ref', function(schema, value, parent, property, dataPath, path, collectErrors) {
		var __ref_s;

		if (schema.__$ref) {
			__ref_s = schema.__$ref;
		} else if (schema.$ref[0] === '#' && (!schema.$ref[1] || schema.$ref[1] === '/')) {
			__ref_s = this.getSchemaByPath(schema.$ref);
		} else {
			__ref_s = this.env.compiled[schema.$ref];
		}

		if (__ref_s) {
			schema.__$ref = __ref_s;
			__ref_s.__validate(value, collectErrors, parent, property, path, this.errors);
			if (!collectErrors && this.errors.length) { return value; }
		} else {
			this.addError({
				code: 'UNKNOWN_REFERENCE',
				expected: schema.$ref,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('allOf', function(schema, value, parent, property, path, collectErrors) {
		var __all_idx = schema.__allOf.length;

		while (__all_idx--) {
			schema.__allOf[__all_idx].__validate(value, collectErrors, parent, property, path, this.errors, collectErrors);
			if (!collectErrors && this.errors.length) { return value; }
		}
	});

	this.addValidator('anyOf', function(schema, value, parent, property, dataPath, collectErrors) {
		var __any_idx = schema.__anyOf.length;
		var __any_valid = false;

		while (__any_idx--) {
			var __any_schema = schema.__anyOf[__any_idx];
			__any_schema.__validate(value, collectErrors, parent, property);

			if (!__any_schema.errors.length) {
				__any_valid = true;
				break;
			}
		}

		if (!__any_valid) {
			this.addError({
				code: 'ANY_OF_MISSING',
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('oneOf', function(schema, value, parent, property, type, dataPath, collectErrors) {
		var __one_idx = schema.__oneOf.length;
		var __one_matched = false;

		while (__one_idx--) {
			var __one_schema = schema.__oneOf[__one_idx];

			__one_schema.__validate(value, collectErrors, parent, property);

			if (!__one_schema.errors.length) {
				if (__one_matched) {
					this.addError({
						code: 'ONE_OF_MULTIPLE',
						dataPath: dataPath
					});
					break;
				} else {
					__one_matched = true;
				}
			}
		}

		if (!__one_matched) {
			this.addError({
				code: 'ONE_OF_MISSING',
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addValidator('not', function(schema, value, dataPath, collectErrors) {
		schema.__not.__validate(value, collectErrors);

		if (!schema.__not.errors.length) {
			this.addError({
				code: 'NOT_PASSED',
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});
}
