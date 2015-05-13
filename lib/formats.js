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
			var __format_email_match = value.match(/^\"([^\"]+)\"@([^\"@]+)$/) ||
				value.match(/^([^@]+)@([^@]+)$/);

			if (__format_email_match) {
				var __format_email_name_reg = /^(?!\.)((?!.*\.{2})[a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFFu20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\.!#$%&'*+-\/=?^_`{|}~\-\d\s]+)$/i;
				var __format_email_domain_reg = /^(?!\.)([a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\-\.\d]+)((\.([a-zA-Z\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF]){2,63})*)$/i;

				if (
					!__format_email_name_reg.test(__format_email_match[1]) ||
					!__format_email_domain_reg.test(__format_email_match[2])
				) {
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
