define(function (require) {
	var ShellColor = require('cjs!src/shell-color')
	var _ = require('underscore')
	var $ = require('jquery')

	QUnit.module('ShellColor')


	var collectInlinePorcessor = function (text, sc, htmls) {
		sc = sc ? sc : new ShellColor
		htmls = htmls ? htmls : []

		sc.on('snippet', function (tag) {
			htmls.push(tag.innerHTML)
		}).reset().write(text)
		return htmls
	}

	var collectBlockPorcessor = function (text, sc, html) {
		sc = sc ? sc : new ShellColor({
			lineFeedMode: 'blockTag'
		})
		html = html ? html : []

		sc.on('snippet', function (tag) {
			html.push(tag.innerHTML)
		}).on('line', function () {
			html.push('\n')
		}).reset().write(text)
		return html
	}


	QUnit.test('inline-processor', function (assert) {
		assert.deepEqual(collectInlinePorcessor('123\n456\n\n789'), ['123<br>456<br><br>789'])
		assert.deepEqual(collectInlinePorcessor('\nabc\n\nefg\n'), ['<br>abc<br><br>efg<br>'])

		var sc = new ShellColor
		assert.deepEqual(collectInlinePorcessor('abc', sc), ['abc'])
		assert.deepEqual(collectInlinePorcessor('\n123\n', sc), ['<br>123<br>'])
		assert.deepEqual(collectInlinePorcessor('\nabc', sc), ['<br>abc'])
	})


	QUnit.test('block-processor()', function (assert) {
		assert.deepEqual(collectBlockPorcessor(''), ['\n'])
		assert.deepEqual(collectBlockPorcessor('  '), ['\n', '  '])
		assert.deepEqual(collectBlockPorcessor('\n'), ['\n', '\n'])
		//assert.deepEqual(collectBlockPorcessor('\n123\n456\n\n789\n'), ['\n', '123', '\n', '456', '\n', '\n', '789', '\n'])
	})

	//QUnit.test('strip()', function (assert) {
	//	assert.equal(sc.strip('abc'), 'abc')
	//	assert.equal(sc.strip(''), '')
	//	assert.equal(sc.strip('\x1b[m'), '')
	//	assert.equal(sc.strip('\x1b[12m'), '')
	//
	//	assert.equal(sc.strip('\x1b[m123'), '123')
	//	assert.equal(sc.strip('\x1b[12m123'), '123')
	//	assert.equal(sc.strip('\x1b[12;34m123'), '123')
	//
	//	assert.equal(sc.strip('\x1b[30m black \x1b[m\x1b[31m red'), ' black  red')
	//	assert.equal(sc.strip('\x1b[12maaa\x1b[mbbb\x1b[12;34;56;78mccc'), 'aaabbbccc')
	//	assert.equal(sc.strip('\x1b[1;31maaa\nbbb\x1b[m'), 'aaa\nbbb')
	//	assert.equal(sc.strip('mm[\x1b[15;23mabcdefg\x1b[mmm'), 'mm[abcdefgmm')
	//})

	//QUnit.test('convertToHtml()', function (assert) {
	//	var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
	//	var $dom = $('<div>').html(sc.convertToHtml(text))
	//	assert.equal($dom.text(), 'abcdefghijklmnopqrst')
	//})
	//
	//QUnit.test('convertToHtml(): callback', function (assert) {
	//	var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
	//	var blockCount = 0
	//	var totalText = ''
	//	var html = sc.convertToHtml(text, function (text) {
	//		totalText += text
	//		if (++blockCount == 2) {
	//			return true
	//		}
	//	})
	//	assert.equal($('<div>').html(html).text(), 'abcdefghijklmn')
	//	assert.equal(totalText, '\u001b[15;23mabcdefg\u001b[mhijklmn')
	//})
	//
	//QUnit.test('convertToHtml(): config color', function (assert) {
	//	var text = '\u001b[15;31m   \u001b[m'
	//	var html = $('<div>').html(sc.convertToHtml(text)).html()
	//	assert.equal(html, '<span style="color:red">   </span>')
	//
	//	var sc2 = new ShellColor({
	//		colors: {
	//			31: 'blue',
	//			32: 'haha'
	//		}
	//	})
	//	html = $('<div>').html(sc2.convertToHtml(text)).html()
	//	assert.equal(html, '<span style="color:blue">   </span>')
	//})
})
