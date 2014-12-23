module.exports = injector;

var REG_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var REG_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var REG_BRACKETS = /(^\{|\}$)/g;
var REG_TRIM_LINES = /(^\n+|\n+$)/g;

function injector(fn) {
	var textFn = fn.toString().replace(REG_COMMENTS, '');

	var args = textFn.match(REG_ARGS)[1].split(',').map(function(arg) {
		return arg.trim();
	}).filter(function(arg) {
		return !!arg;
	});

	var bodyFn = textFn
		.replace(REG_ARGS, '').trim()
		.replace(REG_BRACKETS, '')
		.replace(REG_TRIM_LINES, '');

	var result = { text: bodyFn };
	if (args.length) {
		result.args = args;
	}

	return result;
}
