module.exports = validators;

function validators() {
	this.addValidator('returnIfTypeError', function(value, typeOk) {
		if (typeOk === false) {
			return value;
		}
	});

	this.addValidator('required', function(value, schema, self, missings) {
		var __val_required__idx = schema.required.length;
		while (__val_required__idx--) {
			var __val_required__propName = schema.required[__val_required__idx];
			if (value[__val_required__propName] === undefined) {
				self.addError({
					message: 'MISSING_PROPERTY',
					props: [__val_required__propName]
				});
			}
		}
	});

	this.addValidator('additionalProperties', false, function(value, schema, self, properties) {
		// var __additionalProperties_props = Object.keys(value);
		var __additionalProperties_avaliable = Object.keys(schema.properties);
		var __additionalProperties_idx = properties.length;

		while (__additionalProperties_idx--) {
			var __additionalProperties__propName = schema.required[__additionalProperties_idx];
			if (__additionalProperties_avaliable.indexOf(__additionalProperties__propName) === -1) {
				self.addError({
					message: 'ADDITIONAL_PROPERTY',
					props: [__additionalProperties__propName]
				});
			}
		}
	});

	this.addValidator('properties', function(value, schema, missings) {
		for (var prop in schema.properties) {
			if (missings[prop]) { continue; }
			if (value[prop] === undefined) { continue; }
			schema.__properties[prop](value[prop], value, prop, this.errors);
		}
	});

	this.addValidator('items', function(value, type, schema, self) {
		if (type === 'array') {
			value.forEach(function(item, index) {
				schema.__items(item, value, index, self.errors);
			});
		}
	});
}
