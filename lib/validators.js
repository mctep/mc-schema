module.exports = validators;

function validators() {
	this.addValidator('returnIfTypeError', function(value, typeOk, typeError, type) {
		if (typeOk === false) {
			this.addError({
				message: 'INVALID_TYPE',
				props: [type, typeError]
			});

			return value;
		}
	});

	this.addValidator('required', function(properties, value, schema, type) {
		if (type === 'object') {
			var __r_idx = schema.required.length;
			var __r_missings = [];

			while (__r_idx--) {
				var __r_prop = schema.required[__r_idx];
				if (value[__r_prop] === undefined) {
					__r_missings.push(__r_prop);
				}
			}

			if (__r_missings.length) {
				this.addError({
					code: 'MISSING_PROPERTY',
					props: __r_missings
				});
			}
		}
	});

	this.addValidator('additionalProperties', 'properties');
	this.addValidator('patternProperties', 'properties');

	this.addValidator('properties', function(value, schema, type, properties) {
		if (type == 'object') {
			var __p_idx = properties.length;

			if (schema.patternProperties) {
				var __p_pp = Object.keys(schema.patternProperties);
			}

			while (__p_idx--) {
				var __p_matched = false;
				var __p_prop = properties[__p_idx];
				var __p_value = value[__p_prop];
				var __p_prop_schema = schema.__properties && schema.__properties[__p_prop];
				var __p_required = schema.required && schema.required.indexOf(__p_prop);

				if (__p_prop_schema !== undefined) {
					__p_matched = true;
					if (
						(__p_value === undefined && __p_required && __p_prop_schema.schema.default !== undefined) ||
						(__p_value !== undefined)
					) {
						__p_prop_schema.__validate(__p_value, value, __p_prop, this.errors);
					}
				}

				if (__p_pp) {
					var __p_ppi = __p_pp.length;
					while (__p_ppi--) {
						if (RegExp(__p_pp[__p_ppi]).test(__p_prop)) {
							__p_matched = true;

							var __p_pprop_schema = schema.__patternProperties[__p_pp[__p_ppi]];
							if (
								(__p_value === undefined && __p_required && __p_pprop_schema.schema.default !== undefined) ||
								(__p_value !== undefined)
							) {
								__p_pprop_schema.__validate(__p_value, value, __p_prop, this.errors);
							}
						}
					}
				}

				if (!__p_matched && schema.additionalProperties !== undefined) {
					if (schema.additionalProperties === false) {
						this.addError({
							code: 'ADDITIONAL_PROPERTY',
							prop: __p_prop
						});
					} else if (schema.additionalProperties !== true) {
						schema.__additionalProperties.__validate(__p_value, value, __p_prop, this.errors);
					}
				}

				__p_value = value[__p_prop];
			}
		}
	});

	this.addValidator('additionalItems', 'items');

	this.addValidator('items', function(value, type, schema, self) {
		if (type === 'array') {
			var __i_idx = value.length;
			var __i__items = schema.items || {};

			var __i_is_array = Array.isArray(__i__items);

			if (__i_is_array && value.length > schema.__items.length && schema.additionalItems === false) {
				this.addError({
					message: 'ARRAY_ADDITIONAL_ITEMS',
					props: [value.length, schema.__items.length]
				});
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
						__i_schema.__validate(value[__i_idx], value, __i_idx, this.errors);
					}
				}
			}
		}
	});

	this.addValidator('maxItems', function(value, type, schema) {
		if (type === 'array' && value.length > schema.maxItems) {
			this.addError({
				code: 'MAX_ITEMS',
				props: [value.length, schema.maxItems]
			});
		}
	});

	this.addValidator('minItems', function(value, type, schema) {
		if (type === 'array' && value.length < schema.minItems) {
			this.addError({
				code: 'MIN_ITEMS',
				props: [value.length, schema.minItems]
			});
		}
	});

	this.addValidator('maxLength', function(value, type, schema) {
		if (type === 'string' && value.length > schema.maxLength) {
			this.addError({
				code: 'MAX_LENGTH',
				props: [value.length, schema.maxLength]
			});
		}
	});

	this.addValidator('minLength', function(value, type, schema) {
		if (type === 'string' && value.length < schema.minLength) {
			this.addError({
				code: 'MIN_LENGTH',
				props: [value.length, schema.minLength]
			});
		}
	});

	this.addValidator('maxProperties', function(value, type, schema, properties) {
		if (type === 'object' && properties.length > schema.maxProperties) {
			this.addError({
				code: 'MAX_PROPERTIES',
				props: [properties.length, schema.maxProperties]
			});
		}
	});

	this.addValidator('minProperties', function(value, type, schema, properties) {
		if (type === 'object' && properties.length < schema.minProperties) {
			this.addError({
				code: 'MIN_PROPERTIES',
				props: [properties.length, schema.minProperties]
			});
		}
	});

	this.addValidator('enum', function(value, schema, type, properties) {
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
				code: 'ENUM',
				props: [value, schema.enum]
			});
		}
	});

	this.addValidator('minimum', function(value, type, schema) {
		if (type === 'integer' || type === 'number') {
			var __min;

			if (schema.exclusiveMinimum) {
				__min =  value <= schema.minimum;
			} else {
				__min =  value < schema.minimum;
			}

			if (__min) {
				this.addError({
					code: 'MINIMUM',
					props: [value, schema.minimum]
				});
			}
		}
	});

	this.addValidator('maximum', function(value, type, schema) {
		if (type === 'integer' || type === 'number') {
			var __max;

			if (schema.exclusiveMaximum) {
				__max =  value >= schema.maximum;
			} else {
				__max =  value > schema.maximum;
			}

			if (__max) {
				this.addError({
					code: 'MAXIMUM',
					props: [value, schema.maximum]
				});
			}
		}
	});

	this.addValidator('uniqueItems', function(type, schema, value) {
		if (type === 'array' && schema.uniqueItems === true) {
			var __uni_ids = [];
			if (this.isArrayUnique(value, __uni_ids) === false) {
				this.addError({
					code: 'UNIQUE_ITEMS',
					props: __uni_ids
				});
			}
		}
	});

	this.addValidator('pattern', function(type, value, schema) {
		if (type === 'string') {
			if (RegExp(schema.pattern).test(value) === false) {
				this.addError({
					code: 'PATTERN',
					props: [value, schema.pattern]
				});
			}
		}
	});

	this.addValidator('$ref', function(schema, value, parent, property) {
		var __ref_s;

		if (schema.$ref[0] === '#') {
			__ref_s = this.getSchemaByPath(schema.$ref);
		} else {
			__ref_s = this.env.compiled[schema.$ref];
		}

		if (__ref_s) {
			__ref_s.__validate(value, parent, property, this.errors);
		} else {
			this.addError({
				code: 'NOT_RESOLVED_REF',
				params: [schema.$ref]
			});
		}
	});
}
