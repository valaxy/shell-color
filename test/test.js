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

	QUnit.test('removeMark', function (assert) {
		assert.equal(sc.removeMark('mm[[15;23mabcdefg[mmm'), 'mm[abcdefgmm');
	});


	QUnit.test('convertToHtml', function (assert) {
		assert.equal(sc.removeMark('[1;31maaa\nbbb[m'), 'aaa\nbbb');
	});


});