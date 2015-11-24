var sgrHelp        = require('./sgr-help'),
    EventEmitter   = require('wolfy87-eventemitter'),
    BlockProcessor = require('./block-processor')


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
 *      colorMap:                a color map
 *      defaultForegroundColor:
 *      defaultBackgroundColor:
 *      textInlineTag:           default is 'span'
 * @Event:
 *      lineStart: trigger at line start
 *      snippet:   trigger at output text
 *      lineEnd:   trigger at line end
 */
var ShellColor = function (options) {
	options = options || {}
	options.colorMap = options.colorMap || {}
	options.defaultForegroundColor = options.defaultForegroundColor || DEFAULT_FOREGROUND_COLOR
	options.defaultBackgroundColor = options.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR
	options.textInlineTag = options.textInlineTag || 'span'
	Object.assign(this, BlockProcessor)

	this._options = options
	this._help = sgrHelp(options)
}


//------------------------------------------------------------------------------------------------------
// Instance API
//------------------------------------------------------------------------------------------------------

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


//------------------------------------------------------------------------------------------------------
// Class API
//------------------------------------------------------------------------------------------------------

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
	 * @param options:
	 *      lineTag:    default is p
	 *      snippetTag: default is span
	 * @returns {Array} html tags include text, tag is used for hold styles
	 */
	toBlockTags: function (str, options) {
		options = options || {}
		options.lineTag = options.lineTag || 'p'
		options.snippetTag = options.snippetTag || 'span'

		var sc = new ShellColor({textInlineTag: options.snippetTag})
		var tags = []
		var lastLine
		sc.on('lineStart', function () {
			lastLine = document.createElement(options.lineTag)
			tags.push(lastLine)
		}).on('snippet', function (tag) {
			lastLine.appendChild(tag)
		})
		sc.reset()
		sc.write(str)

		return tags
	},


	/** Convert string to all inline tags
	 ** text: the string
	 ** options:
	 **     snippetTag: default is span
	 */
	toInlineTags: function (text, options) {
		options = options || {}
		options.snippetTag = options.snippetTag || 'span'

		var sc = new ShellColor({textInlineTag: options.snippetTag})
		var tags = []
		sc.on('lineEnd', function () {
			var br = document.createElement('br')
			tags.push(br)
		})
		sc.on('snippet', function (tag) {
			tags.push(tag)
		})
		sc.reset()
		sc.write(text)

		return tags
	}
})

module.exports = ShellColor


//InlineProcessor = require('./inline-processor'),

//options.lineFeedMode = options.lineFeedMode || 'brTag'
//
//switch (options.lineFeedMode) {
//	case 'brTag':
//		Object.assign(this, InlineProcessor)
//		break
//	case 'blockTag':
//		Object.assign(this, BlockProcessor)
//		break
//}