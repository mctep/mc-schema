module.exports = Environment;

Environment.prototype.addValidator = addValidator;
Environment.prototype.addType = addType;
Environment.prototype.addTypeSchema = addTypeSchema;
Environment.prototype.addVariable = addVariable;

Environment.prototype.compile = compile;
Environment.prototype.validate = validate;

Environment.prototype.getLastErrors = getLastErrors;
Environment.prototype.isLastValid = isLastValid;

var injector = require('./injector');
var Schema = require('./schema');
var Compiler = require('./compiler');
var uid = require('./uid');

function Environment() {
	this.validators = {};
	this.validatorsType = {};
	this.variables = {};
	this.compiled = {};
}

function compile(schema) {
	var env = this;
	var id = schema.id = schema.id || uid();

	if (env.compiled[id]) { return env.compiled[id]; }

	var compiler = new Compiler(schema, this);
	var fn = compiler.compile();

	return new Schema(fn, schema, env);
}

function validate(schema, data) {
	return this.compile(schema).validate(data);
}

function getLastErrors() {
	return this.errors;
}

function isLastValid() {
	return !!this.errors.length;
}

function addValidator(property, value, fn) {
	var key = property;

	if (typeof value === 'function') {
		fn = value;
		value = undefined;
	} else {
		key = property + value.toString();
	}

	this.validators[key] = injector(fn);
}

function addType(type, fn) {
	this.validatorsType[type] = injector(fn);
}

function addTypeSchema(schema) {
	var id = schema.id;
	var key = uid('__v');

	var text = [
		'if (!typeOk) {',
		'	var %key% = this.env.compiled["%id%"];',
		'	%key%.validate(value);',
		'	typeOk = %key%.valid;',
		'	if (!typeOk) {',
		'		this.errors.push({ message: "TYPE_ORROR", type: "%id%" })',
		'	}',
		'}',
	];

	this.validatorsType['schema#' + id] = {
		text: text,
		args: ['typeOk']
	};
}

function addVariable(property, fn) {
	this.variables[property] = injector(fn || fnVoid);
}

function fnVoid() {}
