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

	QUnit.test('convertToHtml(): config color', function (assert) {
		var text = '[15;31m   [m'
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
