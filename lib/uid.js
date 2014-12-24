var i = 0;

var PREFIX = '__';

module.exports = function(prefix) {
	i++;
	return (prefix || PREFIX) + i;
};
