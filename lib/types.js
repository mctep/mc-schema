module.exports = types;

function types() {
	this.addType('any', function(typeOk) {
		typeOk = true;
	});

	this.addType('object', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'object';

			if (!typeOk) {
				typeError.push('object');
			}
		}
	});

	this.addType('array', function(value, type, property, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'array';

			if (!typeOk) {
				typeError.push('array');
			}
		}
	});

	this.addType('number', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'number' || type === 'integer';

			if (!typeOk) {
				typeError.push('number');
			}
		}
	});

	this.addType('string', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'string';

			if (!typeOk) {
				typeError.push('string');
			}
		}
	});

	this.addType('boolean', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'boolean';

			if (!typeOk) {
				typeError.push('boolean');
			}
		}
	});

	this.addType('integer', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'integer';

			if (!typeOk) {
				typeError.push('integer');
			}
		}
	});

	this.addType('null', function(value, type, typeOk, typeError) {
		if (!typeOk) {
			typeOk = type === 'null';

			if (!typeOk) {
				typeError.push('null');
			}
		}
	});

}
