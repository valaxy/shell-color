define(function (require) {
	var ShellColor = require('cjs!src/shell-color')
	var $ = require('jquery')

	QUnit.module('ShellColor')

	var collectBlockPorcessor = function (text, sc, html) {
		html = html ? html : []
		var bind = function () {
			sc.on('snippet', function (tag) {
				html.push(tag.innerHTML)
			}).on('lineStart', function () {
				html.push('^')
			}).on('lineEnd', function () {
				html.push('$')
			})
		}
		if (sc) {
			bind()
			sc.write(text)
		} else {
			sc = new ShellColor
			bind()
			sc.reset().write(text)
		}

		return html
	}


	QUnit.test('block-processor()', function (assert) {
		assert.deepEqual(collectBlockPorcessor(''), ['^'])
		assert.deepEqual(collectBlockPorcessor('  '), ['^', '  '])
		assert.deepEqual(collectBlockPorcessor('\n'), ['^', '$', '^'])
		assert.deepEqual(collectBlockPorcessor('\n\n'), ['^', '$', '^', '$', '^'])
		assert.deepEqual(collectBlockPorcessor('\n123\n'), ['^', '$', '^', '123', '$', '^'])
		assert.deepEqual(collectBlockPorcessor('\n123\n456\n\n789\n'), [
			'^', '$',
			'^', '123', '$',
			'^', '456', '$',
			'^', '$',
			'^', '789', '$',
			'^'])

		var sc = new ShellColor
		sc.reset()
		assert.deepEqual(collectBlockPorcessor('a', sc), ['a']) // ignore first lineStart
		assert.deepEqual(collectBlockPorcessor('b\nc', sc), ['b', '$', '^', 'c'])
		assert.deepEqual(collectBlockPorcessor('\nd\n', sc), ['$', '^', 'd', '$', '^'])
		assert.deepEqual(collectBlockPorcessor('\ne\n', sc), ['$', '^', 'e', '$', '^'])
		assert.deepEqual(collectBlockPorcessor('fg', sc), ['fg'])
	})


	QUnit.test('options: snippetTag', function (assert) {
		var sc = new ShellColor
		sc.on('snippet', function (tag) {
			assert.equal(tag.tagName, 'SPAN')
		})
		sc.reset()
		sc.write('abc')

		sc = new ShellColor({snippetTag: 'i'})
		sc.on('snippet', function (tag) {
			assert.equal(tag.tagName, 'I')
		})
		sc.reset()
		sc.write('abc')
	})

	QUnit.test('strip()', function (assert) {
		assert.equal(ShellColor.strip('abc'), 'abc')
		assert.equal(ShellColor.strip(''), '')
		assert.equal(ShellColor.strip('\x1b[m'), '')
		assert.equal(ShellColor.strip('\x1b[12m'), '')

		assert.equal(ShellColor.strip('\x1b[m123'), '123')
		assert.equal(ShellColor.strip('\x1b[12m123'), '123')
		assert.equal(ShellColor.strip('\x1b[12;34m123'), '123')

		assert.equal(ShellColor.strip('\x1b[30m black \x1b[m\x1b[31m red'), ' black  red')
		assert.equal(ShellColor.strip('\x1b[12maaa\x1b[mbbb\x1b[12;34;56;78mccc'), 'aaabbbccc')
		assert.equal(ShellColor.strip('\x1b[1;31maaa\nbbb\x1b[m'), 'aaa\nbbb')
		assert.equal(ShellColor.strip('mm[\x1b[15;23mabcdefg\x1b[mmm'), 'mm[abcdefgmm')
	})

	QUnit.test('toInlineTags()', function (assert) {
		// escape code
		var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
		var $dom = $('<div>')
		ShellColor.toInlineTags(text).forEach(function (tag) {
			$dom.append(tag)
		})
		assert.equal($dom.text(), 'abcdefghijklmnopqrst')

		// \n
		text = 'abc\nefg\nxyz'
		var tagNames = ShellColor.toInlineTags(text).map(function (tag) {
			return tag.tagName
		})
		assert.deepEqual(tagNames, ['SPAN', 'BR', 'SPAN', 'BR', 'SPAN'])
	})


	QUnit.test('toBlockTags()', function (assert) {
		var text = '\u001b[15;23mabcdefg\n\u001b[mhijklmn\n\u001b[15;24mopqrst\u001b[m'
		var lines = ShellColor.toBlockTags(text).map(function (blockTag) {
			return blockTag.innerText
		})
		assert.deepEqual(lines, [
			'abcdefg',
			'hijklmn',
			'opqrst'
		])
	})
})

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


//QUnit.test('inline-processor', function (assert) {
//	assert.deepEqual(collectInlinePorcessor('123\n456\n\n789'), ['123<br>456<br><br>789'])
//	assert.deepEqual(collectInlinePorcessor('\nabc\n\nefg\n'), ['<br>abc<br><br>efg<br>'])
//
//	var sc = new ShellColor
//	assert.deepEqual(collectInlinePorcessor('abc', sc), ['abc'])
//	assert.deepEqual(collectInlinePorcessor('\n123\n', sc), ['<br>123<br>'])
//	assert.deepEqual(collectInlinePorcessor('\nabc', sc), ['<br>abc'])
//})

//var collectInlinePorcessor = function (text, sc, htmls) {
//	sc = sc ? sc : new ShellColor
//	htmls = htmls ? htmls : []
//
//	sc.on('snippet', function (tag) {
//		htmls.push(tag.innerHTML)
//	}).reset().write(text)
//	return htmls
//}
