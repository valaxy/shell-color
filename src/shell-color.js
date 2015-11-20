var sgrHelp         = require('./sgr-help'),
    EventEmitter    = require('eventEmitter'),
    InlineProcessor = require('./inline-processor'),
    BlockProcessor  = require('./block-processor')


// tip: when you add groups, the groups will also show in split array
var ESCAPE_CODE_REG = /\x1b\[(?:(\d+)(?:;(\d+))*)?m/
var ESCAPE_CODE_REG_MUL = /\x1b\[(?:\d+(?:;\d+)*)?m/g
var ESCAPE_CODE_REG_FOR_SPLIT2 = /(\x1b\[(?:\d+(?:;\d+)*)?m)/g

// color
var DEFAULT_FOREGROUND_COLOR = 'white'
var DEFAULT_BACKGROUND_COLOR = 'black'

/**
 * Create a new ShellColor instance
 * @class ShellColor
 * @paras options
 *      colorMap:           a color map
 *      lineFeedMode:      'brTag'(default) | 'blockTag'
 *      textInlineTag:      default is 'span'
 * @Event:
 *      snippet: about tag
 *      line:    only on blockTag mode
 */
var ShellColor = function (options) {
	options = options || {}
	options.colorMap = options.colorMap || {}
	options.defaultForegroundColor = options.defaultForegroundColor || DEFAULT_FOREGROUND_COLOR
	options.defaultBackgroundColor = options.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR
	options.lineFeedMode = options.lineFeedMode || 'brTag'
	options.textInlineTag = options.textInlineTag || 'span'

	this._options = options
	this._help = sgrHelp(options)

	switch (options.lineFeedMode) {
		case 'brTag':
			Object.assign(this, InlineProcessor)
			break
		case 'blockTag':
			Object.assign(this, BlockProcessor)
			break
	}
}


Object.assign(ShellColor.prototype, {
	_consumeCodes: function (escapeMatch) {
		if (escapeMatch.length == 3 && escapeMatch[1] == undefined && escapeMatch[2] == undefined) {
			return this._help.consumeSGR(0, this._sgr) // default
		}

		// escapeMatch[0] == total string
		for (var i = 1; i < escapeMatch.length; i++) {
			var code = Number(escapeMatch[i])
			this._help.consumeSGR(code, this._sgr)
		}
	},

	_createInlineTag: function (text) {
		var inlineTag = this._help.createTagBySGR(this._options.textInlineTag, this._sgr)
		inlineTag.innerText = text
		return inlineTag
	},

	_onWrite: function () {
		throw new Error('onWrite not implement')
	},

	_onReset: function () {
		throw new Error('onReset not implement')
	},

	/**
	 * Write string to stream and output a series of HTML tag from event
	 * @param text - a string which has style info about styles
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
				this._onWrite(fragment, this._sgr)
			}
		}.bind(this))

		return this
	},


	/**
	 * Reset SGR parameters and stream
	 */
	reset: function () {
		this._sgr = this._help.getDefaultSGR()
		this._onReset()
		return this
	}
}, EventEmitter.prototype)


Object.assign(ShellColor, {
	/**
	 * Eliminate the ansi escape code in the string.
	 * @memberof! ShellColor
	 * @param {string} str - a string with ansi escape code
	 * @returns {string} returns the text without ansi escape code
	 */
	strip: function (str) {
		return str.replace(ESCAPE_CODE_REG_MUL, '')
	},

	/**
	 * Convert string which has style info to html tags.
	 * @param str - a string which has style info about styles
	 * @returns {Array} html tags include text, tag is used for hold styles
	 */
	convertToHTMLTags: function (str) {
		// distinguish text and ansi escape code
		var blocks = str.split(ESCAPE_CODE_REG_FOR_SPLIT2)
		this._lastLine = document.createElement(this._options.textBlockTag)

		var tags = []
		for (var i = 0; i < blocks.length; i++) {
			var s = blocks[i]

			var escapeMatch = s.match(ESCAPE_CODE_REG)
			if (escapeMatch) { // ansi escape code
				consumeCodes(this._help, this._sgr, escapeMatch)
			} else {           // normal text
				tags.push.apply(tags, this._transformText(s))
			}
		}

		return tags
	},
})

module.exports = ShellColor


//// transform text on type of brTag
//_transformText_brTag: function (text) {
//	var inlineTag = this._help.createTagBySGR(this._options.textInlineTag, this._sgr)
//	inlineTag.innerText = text
//	return [inlineTag]
//},

//var encodeStr = function (str) {
//	var s = ''
//	for (var i = 0; i < str.length; i++) {
//		s += '&#' + str.charCodeAt(i) + ';'
//	}
//	return s
//}


//
///**
// * Convert string which has style info to html.
// * @memberof! ShellColor
// * @param {string} str - a string which has style info about styles
// * @returns {string} converted HTML
// */
//convertToHTML: function (str) {
//	var tags = this.convertToHTMLTags(str)
//	var html = ''
//	tags.forEach(function (tag) {
//		html += tag.outerHTML
//	})
//	return html
//},