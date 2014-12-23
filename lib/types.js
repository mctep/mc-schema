module.exports = types;

function types() {
	this.addType('any', function() {});

	this.addType('object', function(value, type, typeOk) {
		if (!typeOk) {
			typeOk = type === 'object';

			if (!typeOk) {
				this.addError({
					message: 'INVALID_TYPE',
					props: [type, 'object']
				});
			}
		}
	});

	this.addType('array', function(value, type, property, typeOk) {
		if (!typeOk) {
			typeOk = type === 'array';

			if (!typeOk) {
				this.addError({
					message: 'INVALID_TYPE',
					props: [type, 'array']
				});
			}
		}
	});

	this.addType('number', function(value, type, typeOk) {
		if (!typeOk) {
			typeOk = type === 'number';

			if (!typeOk) {
				this.addError({
					message: 'INVALID_TYPE',
					props: [type, 'number']
				});
			}
		}
	});

	this.addType('string', function(value, type, typeOk) {
		if (!typeOk) {
			typeOk = type === 'string';

			if (!typeOk) {
				this.addError({
					message: 'INVALID_TYPE',
					props: [type, 'string']
				});
			}
		}
	});

}
