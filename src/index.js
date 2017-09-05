
const SGRParser     = require('./sgr-parser')
const SGRParserPort = require('./sgr-parser-port')
const EventEmitter  = require('wolfy87-eventemitter')

// color
var DEFAULT_FOREGROUND_COLOR = 'white'
var DEFAULT_BACKGROUND_COLOR = 'black'


/** Create a new ShellColor instance
 ** options:
 **     snippetTag:             default is 'span'
 **     colorMap:               default is empty, a map of sgr color name to color css
 **     defaultForegroundColor: default is 'white'
 **     defaultBackgroundColor: default is 'black'
 **     useWorker:              default is false, if true, worker must exist
 **     worker:
 **         path:
 **         callback:
 ** Events:
 **     reset:     trigger at reset
 **     lineStart: trigger at line start
 **     snippet:   trigger at output text
 **     lineEnd:   trigger at line end
 */
var ShellColor = function (options) {
	options = options || {}
	this._colorMap = options.colorMap || {}
	this._snippetTag = options.snippetTag || 'span'
	this._initParser(options)
}


//------------------------------------------------------------------------------------------------------
// Instance API
//------------------------------------------------------------------------------------------------------

Object.assign(ShellColor.prototype, {
	_initParser: function (options) {
		var defaultForegroundColor = options.defaultForegroundColor || DEFAULT_FOREGROUND_COLOR
		var defaultBackgroundColor = options.defaultBackgroundColor || DEFAULT_BACKGROUND_COLOR
		if (options.useWorker) {
			this._parser = new SGRParserPort({
				workerPath            : options.worker.path,
				callback              : options.worker.callback,
				defaultForegroundColor: defaultForegroundColor,
				defaultBackgroundColor: defaultBackgroundColor
			})
		} else {
			this._parser = new SGRParser({
				defaultForegroundColor: defaultForegroundColor,
				defaultBackgroundColor: defaultBackgroundColor
			})
		}

		this._parser.on('reset', function () {
			this.trigger('reset')
		}.bind(this))

		this._parser.on('lineStart', function () {
			this.trigger('lineStart')
		}.bind(this))

		this._parser.on('snippet', function (text, sgr) {
			this.trigger('snippet', [this._createInlineTag(text, sgr), text])
		}.bind(this))

		this._parser.on('lineEnd', function () {
			this.trigger('lineEnd')
		}.bind(this))
	},

	// Get color css by SGR color name
	_getCssColor: function (sgrColor) {
		if (sgrColor in this._colorMap) {
			return this._colorMap[sgrColor]
		}

		switch (sgrColor) {
			case 'black':
				return '#000000'
			case 'red':
				return '#FF4136'
			case 'green':
				return '#2ECC40'
			case 'yellow':
				return '#FFDC00'
			case 'blue':
				return '#0074D9'
			case 'magenta':
				return '#85144B'
			case 'cyan':
				return '#001F3F'
			case 'white':
				return '#FFFFFF'
			default:
				throw sgrColor + ' is invalid SGR color name'
		}
	},

	_createInlineTag: function (text, sgr) {
		var tag = document.createElement(this._snippetTag)
		tag.style.color = this._getCssColor(sgr.color)
		tag.style.background = this._getCssColor(sgr.background)
		tag.style.fontWeight = sgr.bold ? 'weight' : 'normal'
		tag.style.fontStyle = sgr.italic ? 'italic' : 'normal'
		tag.style.textDecoration = sgr.underline ? 'underline' : ''
		tag.style.textDecoration += sgr.deletion ? ' line-through' : ''
		tag.style.textDecoration += sgr.overline ? ' overline' : ''
		tag.innerText = text
		return tag
	},

	reset: function () {
		this._parser.reset()
		return this
	},

	write: function (text) {
		this._parser.write(text)
		return this
	},

	stopWorker: function () {
		if (this._parser instanceof SGRParserPort) {
			this._parser.stop()
		} else {
			throw new Error('not a worker mode')
		}
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
		return SGRParser.strip(str)
	},

	/**
	 * Convert string which has style info to html tags.
	 * @param str - a string which has style info about styles
	 * @param options:
	 *      lineTag:    default is p
	 *      snippetTag: default is span
	 *      others of ShellColor
	 * @returns {Array} html tags include text, tag is used for hold styles
	 */
	toBlockTags: function (str, options) {
		options = options || {}
		options.lineTag = options.lineTag || 'p'
		options.snippetTag = options.snippetTag || 'span'

		var sc = new ShellColor(options)
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
	 **     others of ShellColor
	 */
	toInlineTags: function (text, options) {
		options = options || {}
		options.snippetTag = options.snippetTag || 'span'

		var sc = new ShellColor(options)
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
