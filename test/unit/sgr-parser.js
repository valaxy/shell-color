var SGRParser = require('../../src/sgr-parser')

QUnit.module('SGRParser')

var collectBlockPorcessor = function (text, sc, html) {
	html = html ? html : []
	var bind = function () {
		sc.on('snippet', function (text, style) {
			html.push(text)
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
		sc = new SGRParser({
			defaultForegroundColor: 'white',
			defaultBackgroundColor: 'blue'
		})
		bind()
		sc.reset().write(text)
	}

	return html
}


QUnit.test('write()', function (assert) {
	// test independent
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

	// test series of
	var sc = new SGRParser({
		defaultForegroundColor: 'white',
		defaultBackgroundColor: 'blue'
	})
	sc.reset()
	assert.deepEqual(collectBlockPorcessor('a', sc), ['a']) // ignore first lineStart
	assert.deepEqual(collectBlockPorcessor('b\nc', sc), ['b', '$', '^', 'c'])
	assert.deepEqual(collectBlockPorcessor('\nd\n', sc), ['$', '^', 'd', '$', '^'])
	assert.deepEqual(collectBlockPorcessor('\ne\n', sc), ['$', '^', 'e', '$', '^'])
	assert.deepEqual(collectBlockPorcessor('fg', sc), ['fg'])
})


QUnit.test('event: onSnippet', function (assert) {
	var parser = new SGRParser({
		defaultForegroundColor: 'blue',
		defaultBackgroundColor: 'black'
	})
	parser.on('snippet', function (text, style) {
		assert.equal(text, 'XXXXXX')
		assert.deepEqual(style, {
			color     : 'yellow',
			background: 'black',
			bold      : false,
			italic    : false,
			underline : false,
			deletion  : true,
			overline  : false
		})
	})
	parser.reset().write('\x1b[33;9mXXXXXX')
})


QUnit.test('strip()', function (assert) {
	assert.equal(SGRParser.strip('abc'), 'abc')
	assert.equal(SGRParser.strip(''), '')
	assert.equal(SGRParser.strip('\x1b[m'), '')
	assert.equal(SGRParser.strip('\x1b[12m'), '')

	assert.equal(SGRParser.strip('\x1b[m123'), '123')
	assert.equal(SGRParser.strip('\x1b[12m123'), '123')
	assert.equal(SGRParser.strip('\x1b[12;34m123'), '123')

	assert.equal(SGRParser.strip('\x1b[30m black \x1b[m\x1b[31m red'), ' black  red')
	assert.equal(SGRParser.strip('\x1b[12maaa\x1b[mbbb\x1b[12;34;56;78mccc'), 'aaabbbccc')
	assert.equal(SGRParser.strip('\x1b[1;31maaa\nbbb\x1b[m'), 'aaa\nbbb')
	assert.equal(SGRParser.strip('mm[\x1b[15;23mabcdefg\x1b[mmm'), 'mm[abcdefgmm')
})
