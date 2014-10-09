seajs.config({
	base: '../'
});

seajs.use([
	'src/shell-color'
], function (ShellColor) {

	var sc;

	QUnit.module('module', {
		setup: function () {
			sc = new ShellColor;
		},
		teardown: function () {

		}
	});

	QUnit.test('removeColorInfo', function (assert) {
		assert.equal(sc.removeColorInfo('mm[[15;23mabcdefg[mmm'), 'mm[abcdefgmm');
	});


});