define(function (require) {
	var ShellColor = require('src/shell-color')
	var $ = require('jquery')
	var sc

	QUnit.module('module', {
		setup: function () {
			sc = new ShellColor
		}
	})

	QUnit.test('removeMark()', function (assert) {
		assert.equal(sc.removeMark('mm[[15;23mabcdefg[mmm'), 'mm[abcdefgmm')
		assert.equal(sc.removeMark('[1;31maaa\nbbb[m'), 'aaa\nbbb')
	})

	QUnit.test('convertToHtml()', function (assert) {
		var text = '[15;23mabcdefg[mhijklmn[15;24mopqrst[m'
		var $dom = $('<div>').html(sc.convertToHtml(text))
		assert.equal($dom.text(), 'abcdefghijklmnopqrst')
	})


	QUnit.test('convertToHtml(): callback', function (assert) {
		var text = '[15;23mabcdefg[mhijklmn[15;24mopqrst[m'
		var blockCount = 0
		var totalText = ''
		var html = sc.convertToHtml(text, function (text) {
			totalText += text
			if (++blockCount == 2) {
				return true
			}
		})
		assert.equal($('<div>').html(html).text(), 'abcdefghijklmn')
		assert.equal(totalText, '[15;23mabcdefg[mhijklmn')
	})
})
