var JsonPath = module.exports = {};

JsonPath.get = get;
JsonPath.set = set;
JsonPath.remove = remove;

function get(obj, path) {
	var keys = path.replace(/\/+/g,'/').replace(/\/$/, '').split('/');
	if (keys[0] == '#') { keys.shift(); }

	while (keys.length) {
		var key = keys.shift();

		if (obj === undefined) {
			break;
		}

		obj = obj[key];

	}

	return obj;
}

function set(obj, path, value) {
	var keys = path.replace(/\/+/g,'/').replace(/\/$/, '').split('/');
	if (keys[0] == '#') { keys.shift(); }
	if (!keys.length) { return value; }

	var result = obj;

	for (var idx = 0, c = keys.length; idx < c; idx++) {
		if (result === undefined) {
			break;
		}

		var key = keys[idx];

		if (c - idx > 1) {
			result = result[key];
			continue;
		}

		result[key] = value;
		return obj;
	}
}

function remove(obj, path) {
	var keys = path.replace(/\/+/g,'/').replace(/\/$/, '').split('/');
	if (keys[0] == '#') { keys.shift(); }
	if (!keys.length) { return undefined; }

	var result = obj;

	for (var idx = 0, c = keys.length; idx < c; idx++) {
		var key = keys[idx];

		if (result === undefined) {
			break;
		}

		if (c - idx > 1) {
			result = result[key];
			continue;
		}

		if (typeof result === 'object' && result !== null) {
			if (Array.isArray(result)) {
				result.splice(key, 1);
			} else {
				delete result[key];
			}

			return obj;
		}
	}

	return obj;
}
