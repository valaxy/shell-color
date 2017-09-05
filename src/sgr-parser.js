const SGR          = require('./sgr')
const EventEmitter = require('wolfy87-eventemitter')

// tip: when you add groups, the groups will also show in split array
var ESCAPE_CODE_REG = /\x1b\[(?:(\d+)(?:;(\d+))*)?m/
var ESCAPE_CODE_REG_MUL = /\x1b\[(?:\d+(?:;\d+)*)?m/g
var ESCAPE_CODE_REG_FOR_SPLIT2 = /(\x1b\[(?:\d+(?:;\d+)*)?m)/g


/** Events:
 **     reset:
 **     lineStart:
 **     snippet:
 **     lineEnd:
 */
var SGRParser = function (options) {
	this._sgr = SGR(options)
}

Object.assign(SGRParser.prototype, {
	_consumeCodes: function (escapeMatch) {
		if (escapeMatch.length == 3 && escapeMatch[1] == undefined && escapeMatch[2] == undefined) {
			return this._sgr.consumeCode(0) // default
		}

		// escapeMatch[0] == total string
		for (var i = 1; i < escapeMatch.length; i++) {
			var code = Number(escapeMatch[i])
			this._sgr.consumeCode(code)
		}
	},

	_appendSnippet: function (text, style) {
		this.trigger('snippet', [text, style])
	},


	// when init
	_onReset: function () {
		this.trigger('reset')
		this.trigger('lineStart')
	},


	// when ShellColor receive text push
	_onWrite: function (text) {
		var snippets = text.split('\n')
		var firstSnippet = snippets[0]
		var style = this._sgr.getStyle()


		// first snippet belongs to last line
		if (firstSnippet != '') {
			this._appendSnippet(firstSnippet, style)
		}

		// add rest snippets
		for (var i = 1; i < snippets.length; i++) {
			this.trigger('lineEnd')
			this.trigger('lineStart')
			var snippet = snippets[i]
			if (snippet != '') { // ignore empty string
				this._appendSnippet(snippet, style)
			}
		}
	},


	/** Write text to stream and output a series of snippets with SGR info from event
	 ** @param text - a string which has style info about styles
	 */
	write: function (text) {
		// distinguish text and ansi escape code
		var fragments = text.split(ESCAPE_CODE_REG_FOR_SPLIT2)

		// transform each fragment
		fragments.forEach(function (fragment) {
			var escapeMatch = fragment.match(ESCAPE_CODE_REG)
			if (escapeMatch) { // ansi escape code
				this._consumeCodes(escapeMatch)
			} else {           // normal text
				this._onWrite(fragment)
			}
		}.bind(this))

		return this
	},


	/** Reset SGR parameters and stream
	 */
	reset: function () {
		this._onReset()
		return this
	}
}, EventEmitter.prototype)


Object.assign(SGRParser, {
	/**
	 * Eliminate the ansi escape code in the string.
	 * @param {string} str - a string with ansi escape code
	 * @returns {string} returns the text without ansi escape code
	 */
	strip: function (str) {
		return str.replace(ESCAPE_CODE_REG_MUL, '')
	}
})

module.exports = SGRParser
