mcSchema = require '..'

module.exports =

	version: "draft4"

	validate: (schema, document) ->
		v = mcSchema.compile(schema)
		v.validate(document)

	ignores:
		minLength: [
		  "one supplementary Unicode code point is not long enough"
		]

		maxLength: [
		  "two supplementary Unicode code points is long enough"
		]

		"optional/zeroTerminatedFloats": true

		refRemote: true
