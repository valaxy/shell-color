define(function (require) {
	var SGR = require('src/sgr')

	QUnit.module('sgr')

	QUnit.test('getStyle()/consumeCode()', function (assert) {
		var sgr = SGR({
			defaultForegroundColor: 'white',
			defaultBackgroundColor: 'blue'
		})
		assert.deepEqual(sgr.getStyle(), {
			color     : 'white',
			background: 'blue',
			bold      : false,
			italic    : false,
			underline : false,
			deletion  : false,
			overline  : false
		})

		assert.deepEqual(sgr.consumeCode(1), {
			color     : 'white',
			background: 'blue',
			bold      : true,
			italic    : false,
			underline : false,
			deletion  : false,
			overline  : false
		})
	})

})