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
		assert.equal(sc.removeMark('mm[\u001b[15;23mabcdefg\u001b[mmm'), 'mm[abcdefgmm')
		assert.equal(sc.removeMark('\u001b[1;31maaa\nbbb\u001b[m'), 'aaa\nbbb')
	})

	QUnit.test('convertToHtml()', function (assert) {
		var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
		var $dom = $('<div>').html(sc.convertToHtml(text))
		assert.equal($dom.text(), 'abcdefghijklmnopqrst')
	})

	QUnit.test('convertToHtml(): callback', function (assert) {
		var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
		var blockCount = 0
		var totalText = ''
		var html = sc.convertToHtml(text, function (text) {
			totalText += text
			if (++blockCount == 2) {
				return true
			}
		})
		assert.equal($('<div>').html(html).text(), 'abcdefghijklmn')
		assert.equal(totalText, '\u001b[15;23mabcdefg\u001b[mhijklmn')
	})

	QUnit.test('convertToHtml(): config color', function (assert) {
		var text = '\u001b[15;31m   \u001b[m'
		var html = $('<div>').html(sc.convertToHtml(text)).html()
		assert.equal(html, '<span style="color:red">   </span>')

		var sc2 = new ShellColor({
			colors: {
				31: 'blue',
				32: 'haha'
			}
		})
		html = $('<div>').html(sc2.convertToHtml(text)).html()
		assert.equal(html, '<span style="color:blue">   </span>')
	})
})
