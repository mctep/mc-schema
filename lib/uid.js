var i = 0;

var PREFIX = 'http://localhost/schema#';

module.exports = function(prefix) {
	i++;
	return (prefix || PREFIX) + i;
};
