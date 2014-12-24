var JsonPath = module.exports = {};

JsonPath.get = get;
JsonPath.set = set;
JsonPath.remove = remove;

function get(obj, path) {
	var keys = path.replace(/\/+/g,'/').split('/');

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
	var keys = path.replace(/\/+/g,'/').split('/');
	if (keys[0] == '#') { keys.shift(); }

	var result = obj;

	for (var idx = 0, c = keys.length; idx < c; idx++) {
		if (result === undefined) {
			break;
		}

		if (c - idx > 1) {
			result = obj[keys[idx]];
			continue;
		}

		result[keys[idx]] = value;
		return true;
	}
}

function remove(obj, path) {
	var keys = path.replace(/\/+/g,'/').split('/');
	if (keys[0] == '#') { keys.shift(); }

	var result = obj;

	for (var idx = 0, c = keys.length; idx < c; idx++) {
		if (result === undefined) {
			break;
		}

		if (c - idx > 1) {
			result = obj[keys[idx]];
			continue;
		}

		if (typeof result === 'object' && result !== null) {
			if (Array.isArray(result)) {
				result.splice(keys[idx], 1);
			} else {
				delete result[keys[idx]];
			}

			return true;
		}
	}
}
