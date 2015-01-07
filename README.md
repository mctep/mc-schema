mc-schema [![Build Status](https://travis-ci.org/mctep/mc-schema.svg?branch=master)](https://travis-ci.org/mctep/mc-schema)
=========

Very Fast JSON Schema Validator.

This package is collection of ideas [json-model](https://github.com/geraintluff/json-model) and some code [z-schema](https://github.com/zaggino/z-schema).

It compile JSON schema to JavaScript code, like template engines (see below).

## Using

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

result = mcSchema.validate({
    type: 'object',
    required: ['foo', 'bar']
}, {
    foo: 1
});

result.valid; // false

```

## Precompile

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

## Schema `default` property

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

## Coerce after validate

You can fix invalid JSON objects by using `schema.coerce`. It tries to fix value when `INVALID_TYPE` error happens, delete invalid properties and items on `OBJECT_ADDITIONAL_PROPERTIES` or `ARRAY_ADDITIONAL_ITEMS` errors. In other cases it deletes all invalid values. If attemption to fix value is failed, it returns `undefined`;

Simple case:

```js
var schema = mcSchema.compile({
    type: 'object',
    additionalProperties: false,
    required: ['foo'],
    properties: {
        foo: { type: 'boolean' },
        bar: { type: 'string' }
    }
});

var result = schema.coerce({
    foo: 'false',
    bar: 1,
    baz: {}
});

// result = {
//  foo: false,
//  bar: '1'
// };

var result2 = schema.coerce({
    bar: 'baz'
});

//
// result2 = undefined
//
```

Complex case:

```js
var schema = mcSchema.compile({
    type: 'object',
    additionalProperties: false,
    properties: {
        foo: {
            type: 'array',
            additionalItems: false,
            items: [{ type: 'boolean' }]
        },
        bar: {
            type: 'array',
            items: {
                type: 'object',
                required: ['baz'],
                properties: {
                    baz: {
                        type: 'integer'
                    }
                }
            },
            minItems: 1 
        }
    }
});

var result = schema.coerce({
    foo: ['false', 1],
    bar: [{}]
});

// result = {
//  foo: [false]
// }
// 
var result2 = schema.coerce({
    foo: ['false', 1],
    bar: [{ baz: '2.1'}]
});

// result2 = {
//  foo: [false],
//  bar: [{baz: 2}]
// }
```

### Custom type coerce

To add custom type or redefine coerce, use `mcSchema.addTypeCoerce`:

```js
mcSchema.addTypeCoerce('object', function(value) {
    try {
        return JSON.parse(value);
    } catch (e) {}
});

var schema = mcSchema.compile({
    type: 'object',
    properties: {
        foo: { type: 'number' }
    }
});

var result = schema.coerce('{"foo":"1"}');
// result = { foo: 1 }
```

## Tests

This validator uses [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite).
