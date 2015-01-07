mc-schema [![Build Status](https://travis-ci.org/mctep/mc-schema.svg?branch=master)](https://travis-ci.org/mctep/mc-schema)
=========

Very Fast JSON Schema Validator.

This package is collection of ideas [json-model](https://github.com/geraintluff/json-model) and some code [z-schema](https://github.com/zaggino/z-schema).

It compile JSON schema to JavaScript code, like template engines (see below).

# Using

```js
var mcSchema = require('mc-schema');

var result = mcSchema.validate({
    type: 'object',
    required: ['foo', 'bar']
}, {
    foo: 1,
    bar: 2
});

result.valid; // true
result.errors; // []

result = mcSchema.validate({
    type: 'object',
    properties: {
        baz: {
            type: 'object',
            required: ['foo', 'bar'],
            minProperties: 2
        }
    }
}, {
    baz: {
        foo: 1
    }
});

result.valid; // false
result.errors;
// [{
//  code: 'OBJECT_REQUIRED',
//  expected: ['foo', 'bar'],
//  actual: ['foo'],
//  dataPath: '#/baz'
// }, {
//  code: 'OBJECT_PROPERTIES_MINIMUM',
//  expected: 2,
//  actual: 1,
//  dataPath: '#/baz'
// }]


```

# Precompile

For best speed you can compile schemas before validating:

```js
var schema = mcSchema.compile({
    type: 'object',
    required: ['foo', 'bar']
});

schema.validate({}).valid; // false
```

Compilation looks like this:

```js
var schema = {
    type: 'number',
    minimum: 2
};

// compiles to function like

function validate(data) {
    if (typeof data != 'number') { throw 'invalid type'; }

    if (data > 2) { throw 'minumum'; }
}
```

# Schema `default` property

It can be define default properties for `undefined` values by schema if property is required:

```js
var data = {};
var schema = mcSchema.compile({
    type: 'object',
    required: ['foo']
    properties: {
        foo: {
            default: 1
        },
        bar: {
            default: 2
        }
    }
});

var result = schema.validate(data);

result.valid === true;
result.errors.length === 0;
result.data === data;
//
// data === {
//  foo: 1 // only `foo` sets to `default` because it is required
// }
//

```

# Tests

This validator uses [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite).
