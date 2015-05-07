module.exports = formats;

function formats() {
	this.addFormat('date-time', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			var __dt = value.toLowerCase().split('t');

			var __dt_d = __dt[0];
			var __dt_t = __dt[1];
			var __dt_err = false;

			if (!__dt_d || !__dt_t) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
				__dt_err = true;
			}

			if (!__dt_err) {
				var __dt_dm = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(__dt_d);
				if (!__dt_dm) {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
					__dt_err = true;
				} else if (__dt_dm[2] < '01' || __dt_dm[2] > '12' || __dt_dm[3] < '01' || __dt_dm[3] > '31') {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
					__dt_err = true;
				}
			}

			if (!__dt_err) {
				var __dt_tm = /^([0-9]{2}):([0-9]{2}):([0-9]{2})(.[0-9]+)?(z|([+-][0-9]{2}:[0-9]{2}))$/.exec(__dt_t);
				if (!__dt_dm) {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				} else if (__dt_dm[1] > '23' || __dt_dm[2] > '59' || __dt_dm[3] > '59') {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('date', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (!value) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			} else {
				var __d_m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(value);
				if (!__d_m) {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				} else if (__d_m[2] < '01' || __d_m[2] > '12' || __d_m[3] < '01' || __d_m[3] > '31') {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('uri', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (!value) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			} else {
				var __uri_reg = RegExp(
					'^' +
						'(?:(?:\\w+[\\w\\d\\-\\+\\.]*):\/\/)' +
						'(?:\\S+(?::\\S*)?@)?' +
						"(?:" +
							"(?!10(?:\\.\\d{1,3}){3})" +
							"(?!127(?:\\.\\d{1,3}){3})" +
							"(?!169\\.254(?:\\.\\d{1,3}){2})" +
							"(?!192\\.168(?:\\.\\d{1,3}){2})" +
							"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
							"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
							"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
							"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
						"|" +
							"(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)" +
							"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*" +
						")" +
						"(?::\\d{2,5})?" +
						"(?:/[^\\s]*)?" +
					"$", "i");
				if (!__uri_reg.test(value)) {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('email', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (!/^[a-zA-Z0-9+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('ipv4', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (value.indexOf('.') === -1) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			} else {
				if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value)) {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('ipv6', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (!/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(value)) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});

	this.addFormat('hostname', function(type, value, schema, dataPath, collectErrors) {
		if (type === 'string') {
			if (value.length > 255) {
				this.addError({
					code: 'FORMAT',
					expected: schema.format,
					dataPath: dataPath
				});
				if (!collectErrors) { return value; }
			} else {
				var __hm_valid = /^[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?(\.[a-zA-Z](([-0-9a-zA-Z]+)?[0-9a-zA-Z])?)*$/.test(value);

				if (__hm_valid) {
					var __hm_labels = value.split(".");
					var __hm_idx = __hm_labels.length;
					while (__hm_idx--) {
						if (__hm_labels[__hm_idx].length > 63) {
							this.addError({
								code: 'FORMAT',
								expected: schema.format,
								dataPath: dataPath
							});
							if (!collectErrors) { return value; }
							break;
						}
					}
				} else {
					this.addError({
						code: 'FORMAT',
						expected: schema.format,
						dataPath: dataPath
					});
					if (!collectErrors) { return value; }
				}
			}
		} else {
			this.addError({
				code: 'FORMAT',
				expected: schema.format,
				dataPath: dataPath
			});
			if (!collectErrors) { return value; }
		}
	});
}
