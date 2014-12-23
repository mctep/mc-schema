var env = require('./lib');

var schema = env.compile({
	type: 'array',
	items: {
		type: 'object',
		required: ['a', 'b'],
		additionalProperties: false,
		properties: {
			a: { type: 'string' },
			b: { type: 'number' },
			c: { type: 'array' }
		}
	}
});

schema.validate();
console.log(env.getLastErrors());

process.exit(0);

// var zSchema = new (require('../z-schema'))();
// var JsonModel = require('json-model');

// var qnt = 10000;
// function makeData() {
// 	var data = [];
// 	for (var i = 0; i < qnt; i++) {
// 		data.push({
// 			a: '1',
// 			b: 1,
// 			c: []
// 		});
// 	}

// 	return data;
// }

// var env = new JsonSchema();

// var schema1 = env.compile({
// 	type: 'array',
// 	items: {
// 		type: 'object',
// 		required: ['a', 'b'],
// 		additionalProperties: false,
// 		properties: {
// 			a: { type: 'string' },
// 			b: { type: 'number' },
// 			c: { type: 'array' }
// 		}
// 	}
// });

// var data1 = makeData();

// var schema2 = {
// 	type: 'array',
// 	items: {
// 		type: 'object',
// 		required: ['a', 'b'],
// 		additionalProperties: false,
// 		properties: {
// 			a: { type: 'string' },
// 			b: { type: 'number' },
// 			c: { type: 'array' }
// 		}
// 	}
// };

// zSchema.compileSchema(schema2);
// var data2 = makeData();

// var schema3 = JsonModel.validator({
// 	type: 'array',
// 	items: {
// 		type: 'object',
// 		required: ['a', 'b'],
// 		additionalProperties: false,
// 		properties: {
// 			a: { type: 'string' },
// 			b: { type: 'number' },
// 			c: { type: 'array' }
// 		}
// 	}
// });

// var data3 = makeData();

// console.time('schema1');
// schema1.validate(data1);
// console.timeEnd('schema1');

// // console.log(schema1.getLastErrors());

// console.time('schema2');
// zSchema.validate(data2, schema2);
// console.timeEnd('schema2');

// // console.log(zSchema.getLastErrors());

// console.time('schema3');
// schema3(data2);
// console.timeEnd('schema3');
