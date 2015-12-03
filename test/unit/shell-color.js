define(function (require) {
	var ShellColor = require('src/index')
	var $ = require('jquery')

	QUnit.module('ShellColor:NonWorker')

	var createShellColor = function (options, events) {
		var sc = new ShellColor(options)
		sc.on('reset', function () {
			events.push('reset')
		}).on('snippet', function (tag) {
			events.push(tag.innerText)
		}).on('lineStart', function () {
			events.push('^')
		}).on('lineEnd', function () {
			events.push('$')
		})
		return sc
	}

	QUnit.test('_getCssColor()', function (assert) {
		var sc = new ShellColor({
			colorMap: {
				blue  : '#111',
				yellow: '#222'
			}
		})

		assert.equal(sc._getCssColor('white'), '#FFFFFF')
		assert.equal(sc._getCssColor('blue'), '#111')
		assert.equal(sc._getCssColor('yellow'), '#222')
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
		assert.expect(2)
	})

	QUnit.test('eventStream', function (assert) {
		var events = []
		var sc = createShellColor(null, events)
		sc.reset().write('abcd\nxxyy')
		assert.deepEqual(events, [
			'reset',
			'^', 'abcd', '$',
			'^', 'xxyy'
		])
	})


	QUnit.module('ShellColor:Worker')

	QUnit.test('eventStream', function (assert) {
		var done = assert.async()
		var events = []
		var sc = createShellColor({
			useWorker: true,
			worker   : {
				path    : './worker-test.js',
				callback: function () {
					sc.reset().write('abcd\nxxyy')
					setTimeout(function () {
						assert.deepEqual(events, [
							'reset',
							'^', 'abcd', '$',
							'^', 'xxyy'
						])
						done()
					}, 1000) // ensure all output is over after 1s
				}
			}
		}, events)
	})

})


//QUnit.test('toInlineTags()', function (assert) {
//	// escape code
//	var text = '\u001b[15;23mabcdefg\u001b[mhijklmn\u001b[15;24mopqrst\u001b[m'
//	var $dom = $('<div>')
//	ShellColor.toInlineTags(text).forEach(function (tag) {
//		$dom.append(tag)
//	})
//	assert.equal($dom.text(), 'abcdefghijklmnopqrst')
//
//	// \n
//	text = 'abc\nefg\nxyz'
//	var tagNames = ShellColor.toInlineTags(text).map(function (tag) {
//		return tag.tagName
//	})
//	assert.deepEqual(tagNames, ['SPAN', 'BR', 'SPAN', 'BR', 'SPAN'])
//})
//
//
//QUnit.test('toBlockTags()', function (assert) {
//	var text = '\u001b[15;23mabcdefg\n\u001b[mhijklmn\n\u001b[15;24mopqrst\u001b[m'
//	var lines = ShellColor.toBlockTags(text).map(function (blockTag) {
//		return blockTag.innerText
//	})
//	assert.deepEqual(lines, [
//		'abcdefg',
//		'hijklmn',
//		'opqrst'
//	])
//})


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
