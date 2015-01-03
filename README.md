mc-schema
=========

Very Fast JSON Schema Validator.

This package is collection of ideas [json-model](https://github.com/geraintluff/json-model) and some code [z-schema](https://github.com/zaggino/z-schema).

It compile JSON schema to JavaScript code, like template engines (see below).

# Using

```js
var mcSchema = require('mc-schema');

mcSchema.validate({
    type: 'object',
    required: ['foo', 'bar']
}, {
    foo: 1,
    bar: 2
});

mcSchema.isLastValid(); // true

mcSchema.validate({
    type: 'object',
    required: ['foo', 'bar']
}, {
    foo: 1
});

mcSchema.isLastValid(); // false

```

# Precompile

For best speed you can compile schemas before validating:

```js
var schema = mcSchema.compile({
    type: 'object',
    required: ['foo', 'bar']
});

schema.validate({});
schema.isLastValid();
```

Comilation looks like this:

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

# Tests

This validator uses [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite).
