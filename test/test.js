seajs.config({
	base: '../'
})

seajs.use([
	'src/shell-color'
], function (ShellColor) {
	var sc

	module('module', {
		setup: function () {
			sc = new ShellColor;
		},
		teardown: function () {

		}
	})

	test('removeMark', function (assert) {
		assert.equal(sc.removeMark('mm[[15;23mabcdefg[mmm'), 'mm[abcdefgmm')
	})

	test('convertToHtml', function (assert) {
		assert.equal(sc.removeMark('[1;31maaa\nbbb[m'), 'aaa\nbbb')
	})
})