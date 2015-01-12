module.exports = TypeCoerce;

function TypeCoerce() {
	this.addTypeCoerce('string', function(value) {
		if (value === undefined) { return undefined; }

		if (value.toString) { return value.toString(); }
	});

	this.addTypeCoerce('number', function(value) {
		if (value === false) { return 0; }
		if (value === true) { return 1; }
		var res = parseFloat(value, 10);
		return (isFinite(res) && res) || undefined;
	});

	this.addTypeCoerce('integer', function(value) {
		if (value === false) { return 0; }
		if (value === true) { return 1; }
		var res = parseInt(value, 10);
		return (isFinite(res) && res) || undefined;
	});

	this.addTypeCoerce('boolean', function(value) {
		if (value === 'true') { return true; }
		if (value === 'false') { return false; }

		return !!parseInt(value, 10);
	});

	this.addTypeCoerce('array', function(value) {
		if (typeof value === 'string') {
			return value.split(',');
		}
	});
}
