module.exports = Compiler;

var PROPERTIES = [
	'$ref',

	'not',
	'oneOf',
	'allOf',
	'anyOf',

	'minLength',
	'maxLength',
	'pattern',

	'maximum',
	'minimum',
	'multipleOf',

	'properties',
	'patternProperties',
	'additionalProperties',

	'required',
	'maxProperties',
	'minProperties',
	'dependencies',

	'items',
	'additionalItems',

	'maxItems',
	'minItems',

	'enum',

	'uniqueItems'
];

Compiler.prototype.compile = compile;
Compiler.prototype.parsePropertyDefault = parsePropertyDefault;
Compiler.prototype.parsePropertyType = parsePropertyType;
Compiler.prototype.parsePropertyFormat = parsePropertyFormat;
Compiler.prototype.parseProperties = parseProperties;

Compiler.prototype.resolveVariables = resolveVariables;

function Compiler(schema, env) {
	this.variables = ['value', 'typeOk'];
	this.validators = [];
	this.schema = schema;
	this.env = env;
}

function compile() {
	this.parsePropertyDefault();
	this.parsePropertyType();
	this.parsePropertyFormat();
	this.parseProperties();

	var lines = [];

	this.resolveVariables().forEach(function(variable) {
		lines.push(variable.text);
	});

	this.validators.forEach(function(validator) {
		lines.push(validator.text);
	});

	lines.unshift('\tthis.errors = errors || [];');
	lines.push('\treturn value;');

	return new Function('value', 'parent', 'property', 'path', 'errors', lines.join('\n'));
}

function parsePropertyDefault() {
	if (this.schema.default !== undefined) {
		this.variables.push('default');
	}
}

function parsePropertyType() {
	var env = this.env;
	var schema = this.schema;
	var types = this.schema.type;
	var validators = this.validators;

	if (types) {
		types = types instanceof Array ? types : [types];

		types.forEach(function(type) {
			var validator;

			if (typeof type === 'string') {
				validator = env.validatorsType[type];
			}

			if (typeof type === 'object' && !(type instanceof Array)) {
				var schema = env.compile(type);
				env.addTypeSchema(schema.schema);
				validator = env.validatorsType['schema#' + schema.schema.id];
			}

			validators.push(validator);
		});

		validators.push(env.validators.returnIfTypeError);
	}
}

function parsePropertyFormat() {
	var schema = this.schema;
	var format = schema.format && this.env.formats[schema.format];

	if (format) {
		this.validators.push(format);
	}
}

function parseProperties() {
	var env = this.env;
	var schema = this.schema;
	var validators = this.validators;

	PROPERTIES.forEach(function(prop) {
		var valSchema = schema[prop];
		if (valSchema === undefined) { return; }

		var validator = env.validators[prop];

		if (typeof validator === 'string') {
			validator = env.validators[validator];
		}

		if (!validator) { return; }

		if (validators.indexOf(validator) === -1) {
			validators.push(validator);
		}
	});
}

function resolveVariables() {
	var variables = this.variables;

	this.validators.forEach(function(validator) {
		add(variables, validator.args);
	});

	return resolve(variables, this.env);

	function add(arr, vals) {
		if (!vals) { return; }

		vals.forEach(function(val) {
			if (arr.indexOf(val) === -1) {
				arr.push(val);
			}
		});
	}
}

function resolve(variables, env, resolved) {
	resolved = resolved || [];

	variables.forEach(function(name) {
		var variable = env.variables[name];

		if (resolved.indexOf(variable) !== -1) { return; }

		if (!variable) { throw new Error('Undefined variable `' + name + '`'); }

		if (variable.args) {
			resolve(variable.args, env, resolved);
		}

		if (resolved.indexOf(variable) !== -1) { return; }

		resolved.push(variable);
	});

	return resolved;
}
