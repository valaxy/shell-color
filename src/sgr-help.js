define(function () {
	var DEFAULT_FOREGROUND_COLOR = 'white'
	var DEFAULT_BACKGROUND_COLOR = 'black'

	var getSGRColor = function (code) {
		var n = code % 10
		switch (n) {
			case 0:
				return 'black'
			case 1:
				return 'red'
			case 2:
				return 'green'
			case 3:
				return 'yellow'
			case 4:
				return 'blue'
			case 5:
				return 'magenta'
			case 6:
				return 'cyan'
			case 7:
				return 'white'
			default:
				throw n + " is invalid"
		}
	}


	var consumeSGR = function (code, sgr) {
		switch (code) {
			case 0:
				sgr.color = DEFAULT_FOREGROUND_COLOR
				sgr.background = DEFAULT_BACKGROUND_COLOR
				sgr.bold = false
				sgr.italic = false
				sgr.underline = false
				sgr.deletion = false
				sgr.overline = false
				break
			case 1:
				sgr.bold = true
				break
			case 3:
				sgr.italic = true
				break
			case 4:
				sgr.underline = true
				break
			case 9:
				sgr.deletion = true
				break
			case 22:
				sgr.bold = false
				break
			case 23:
				sgr.italic = false
				break
			case 24:
				sgr.underline = false
				break
			case 29:
				sgr.deletion = false
				break
			case 30:
			case 31:
			case 32:
			case 33:
			case 34:
			case 35:
			case 36:
			case 37:
				sgr.color = getSGRColor(code)
				break
			case 39:
				sgr.color = DEFAULT_FOREGROUND_COLOR
				break
			case 40:
			case 41:
			case 42:
			case 43:
			case 44:
			case 45:
			case 46:
			case 47:
				sgr.background = getSGRColor(code)
				break
			case 49:
				sgr.background = DEFAULT_BACKGROUND_COLOR
				break
			case 53:
				sgr.overline = true
				break
			case 55:
				sgr.overline = false
				break
		}

	}

	var getDefaultSGR = function () {
		var sgr = {}
		consumeSGR(0, sgr)
		return sgr
	}


	var getColor = function (color, colorMap) {
		if (color in colorMap) {
			return colorMap[color]
		}

		switch (color) {
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
				throw color + 'is invalid'
		}
	}


	var createTagBySGR = function (sgr, options) {
		var colorMap = options.colorMap
		var span = document.createElement('span')
		span.style.color = getColor(sgr.color, colorMap)
		span.style.background = getColor(sgr.background, colorMap)
		span.style.fontWeight = sgr.bold ? 'weight' : 'normal'
		span.style.fontStyle = sgr.italic ? 'italic' : 'normal'
		span.style.textDecoration = sgr.underline ? 'underline' : ''
		span.style.textDecoration += sgr.deletion ? ' line-through' : ''
		span.style.textDecoration += sgr.overline ? ' overline' : ''
		return span
	}

	return {
		getDefaultSGR : getDefaultSGR,
		consumeSGR    : consumeSGR,
		createTagBySGR: createTagBySGR
	}
})