/*globals describe,beforeEach,afterEach,it*/
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var expect = require('expect.js');

var pathSuite = path.resolve(__dirname, './json-schema-test-suite/tests/draft4/');

var IGNORE = [
	'one supplementary Unicode code point is not long enough',
	'two supplementary Unicode code points is long enough'
];

var validator = require('../lib');

_(fs.readdirSync(pathSuite))
.filter(function(file) {
	return path.extname(file) == '.json';
})
.map(function(file) {
	return [file, require(path.resolve(pathSuite, file))];
})
.each(function(data) {
	var file = data[0];
	var tests = data[1];
	describe(path.basename(file, '.json'), function() {
		_.each(tests, function(test) {
			describe(test.description, function() {
				beforeEach(function() {
					this.schema = validator.compile(test.schema);
				});

				afterEach(function() {
					delete this.schema;
				});

				_.each(test.tests, function(test) {
					if (IGNORE.indexOf(test.description) !== -1) { return; }
					it(test.description, function() {
						this.schema.validate(test.data);
						expect(this.schema.isLastValid()).to.be(test.valid);
					});
				});
			});
		});
	});
});
