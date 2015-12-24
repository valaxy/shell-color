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

	QUnit.test('stopWorker()', function (assert) {
		var done = assert.async()
		var sc = createShellColor({
			useWorker: true,
			worker   : {
				path    : './worker-test.js',
				callback: function () {
					sc.stopWorker()
					assert.ok(true)
					done()
				}
			}
		})
	})

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


	QUnit.module('ShellColor')

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

	QUnit.test('strip()', function (assert) {
		assert.equal(ShellColor.strip('abc'), 'abc')
	})
})
